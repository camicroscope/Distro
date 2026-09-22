#!/usr/bin/env bash
#
# db-upgrade.sh - safely move an existing caMicroscope MongoDB data
# directory onto a new MongoDB major version, by dumping the data out
# of wherever it currently lives and restoring it into a freshly
# initialized instance of the target version -- rather than walking the
# on-disk files through every intermediate major version in place.
# See README.md, "Upgrading the MongoDB data directory", for when you
# need this.
#
# The original data directory is never modified: a fresh replacement is
# built and verified (collection-by-collection document counts compared
# against the source) entirely alongside it first, and is only swapped
# into place -- via a simple, cheap rename -- once that verification
# passes. The old directory is kept as a timestamped sidecar afterward,
# so rollback is just moving it back.
#
# Usage:
#   ./db-upgrade.sh [--target VERSION] [--data-dir PATH] [--db NAME] [--yes] [--dry-run]
#   ./db-upgrade.sh --restore ARCHIVE_FILE [--target VERSION] [--data-dir PATH] [--yes]
#
# With no arguments, moves ./db's "camic" database onto mongo:8.0,
# prompting for confirmation before touching the live data directory.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ALL_VERSIONS=(4.2 4.4 5.0 6.0 7.0 8.0)

DATA_DIR="./db"
TARGET="8.0"
DB_NAME="camic"
ASSUME_YES=0
DRY_RUN=0
RESTORE_ARCHIVE=""
TMP_CONTAINER="ca-mongo-upgrade-tmp"
LOCK_FILE="$SCRIPT_DIR/.db-upgrade.lock"

log() { echo "$@"; }
err() { echo "ERROR: $@" >&2; }

usage() {
  cat <<'EOF'
Usage: ./db-upgrade.sh [options]

Options:
  --target VERSION    Target MongoDB major version: one of 4.4, 5.0, 6.0, 7.0, 8.0.
                       Default: 8.0 (matches caMicroscope.yml / kc_caMicroscope.yml
                       / quip-pathdb.yml).
  --data-dir PATH     MongoDB data directory to move. Default: ./db
  --db NAME           Database to dump/restore. Default: camic
  -y, --yes           Don't prompt for confirmation.
  --dry-run           Do a full rehearsal (dump, restore into a scratch instance,
                       verify) without touching the real data directory or
                       leaving anything behind.
  --restore ARCHIVE   Restore --data-dir from a dump archive produced by this
                       script (found under backups/). Moves the current data
                       directory aside first rather than deleting it.
  -h, --help          Show this help.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    --data-dir) DATA_DIR="$2"; shift 2 ;;
    --db) DB_NAME="$2"; shift 2 ;;
    -y|--yes) ASSUME_YES=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --restore) RESTORE_ARCHIVE="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) err "Unknown option: $1"; usage; exit 1 ;;
  esac
done

is_known_version() {
  local v="$1" x
  for x in "${ALL_VERSIONS[@]}"; do [[ "$x" == "$v" ]] && return 0; done
  return 1
}

if ! is_known_version "$TARGET"; then
  err "Unknown --target '$TARGET'. Must be one of: ${ALL_VERSIONS[*]}"
  exit 1
fi

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    err "docker is not installed or not on PATH."
    exit 1
  fi
  if ! docker info >/dev/null 2>&1; then
    err "docker daemon is not reachable (is Docker running?)."
    exit 1
  fi
}

resolve_abs_dir() {
  local d="$1" parent
  parent="$(cd "$(dirname "$d")" 2>/dev/null && pwd)" || return 1
  echo "${parent}/$(basename "$d")"
}

looks_like_existing_data() {
  local dir="$1"
  [[ -d "$dir" ]] || return 1
  [[ -e "$dir/WiredTiger" ]]
}

pick_shell() {
  local name="$1"
  if docker exec "$name" which mongosh >/dev/null 2>&1; then
    echo mongosh
  else
    echo mongo
  fi
}

extract_fcv() {
  local out="$1"
  echo "$out" | grep -oE "version[\"']?[[:space:]]*:[[:space:]]*[\"'][0-9]+\.[0-9]+[\"']" \
    | head -1 | grep -oE '[0-9]+\.[0-9]+'
}

# Start a temporary, no-host-port mongod container of the given version
# bound to the given data directory. Always (re)creates $TMP_CONTAINER.
start_tmp_container() {
  local ver="$1" dir="$2"
  docker rm -f "$TMP_CONTAINER" >/dev/null 2>&1 || true
  docker run -d --rm --name "$TMP_CONTAINER" -v "${dir}:/data/db" "mongo:${ver}" >/dev/null 2>&1
}

wait_for_ready_or_exit() {
  local name="$1" timeout="${2:-120}" waited=0
  while (( waited < timeout )); do
    local running
    running="$(docker inspect -f '{{.State.Running}}' "$name" 2>/dev/null || echo false)"
    if [[ "$running" != "true" ]]; then
      return 1
    fi
    local shell; shell="$(pick_shell "$name")"
    if docker exec "$name" "$shell" --quiet --eval 'db.adminCommand("ping")' >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
    waited=$((waited + 2))
  done
  return 1
}

stop_tmp_container() {
  docker stop "$TMP_CONTAINER" >/dev/null 2>&1 || true
  local waited=0
  while docker inspect "$TMP_CONTAINER" >/dev/null 2>&1 && (( waited < 20 )); do
    sleep 1
    waited=$((waited + 1))
  done
}

find_bound_container() {
  local abs_dir="$1" cid
  for cid in $(docker ps -q); do
    if docker inspect "$cid" --format '{{range .Mounts}}{{.Source}}{{"\n"}}{{end}}' 2>/dev/null \
        | grep -qxF "$abs_dir"; then
      echo "$cid"
      return 0
    fi
  done
  return 1
}

# Prompts (unless --yes) and stops the container. Never called under
# --dry-run for a stop -- callers check DRY_RUN themselves, since a live
# container is safe to *read* from during a dry run, just not to stop.
stop_bound_container_with_confirmation() {
  local cid="$1" name
  name="$(docker inspect -f '{{.Name}}' "$cid" | sed 's#^/##')"
  log "Container '$name' must be stopped to install the upgraded data directory."
  if [[ $ASSUME_YES -eq 0 ]]; then
    read -r -p "Stop '$name' now? [y/N] " REPLY
    [[ "$REPLY" =~ ^[Yy]$ ]] || { log "Aborted. Stop it yourself and re-run, e.g.: docker stop $name"; exit 1; }
  fi
  docker stop "$cid" >/dev/null
  log "Stopped '$name'."
}

# Try binary versions oldest to newest until one starts successfully
# against $1; print the version that worked (this is also the version
# whose mongodump we'll use to read the data, and matches this app's
# on-disk data since binaries only start against data at or one step
# behind their own FCV).
detect_current_version() {
  local abs_dir="$1" ver
  for ver in "${ALL_VERSIONS[@]}"; do
    log "  trying mongo:$ver ..." >&2
    if start_tmp_container "$ver" "$abs_dir" && wait_for_ready_or_exit "$TMP_CONTAINER" 60; then
      echo "$ver"
      return 0
    fi
    stop_tmp_container
  done
  return 1
}

# Prints "name:count,name:count,..." (sorted by name) for every
# collection in $DB_NAME inside the given running container. Used to
# verify the restored data matches the source before ever touching the
# real data directory.
collection_summary() {
  local name="$1" shell db="$2"
  shell="$(pick_shell "$name")"
  docker exec "$name" "$shell" --quiet --eval "
    (function(){
      var d = db.getSiblingDB('$db');
      var names = d.getCollectionNames().sort();
      var out = [];
      names.forEach(function(n){ out.push(n + ':' + d.getCollection(n).countDocuments({})); });
      print(out.join(','));
    })();
  " admin 2>&1 | tail -1
}

# Runs mongodump for $DB_NAME inside container $1, copies the resulting
# gzip archive to host path $2. Returns non-zero on any failure.
dump_from_container() {
  local name="$1" dest="$2"
  docker exec "$name" sh -c "rm -f /tmp/db-upgrade-dump.archive.gz && mongodump --db=$DB_NAME --archive=/tmp/db-upgrade-dump.archive.gz --gzip" \
    >/dev/null 2>/tmp/db-upgrade-dump.err
  if [[ $? -ne 0 ]]; then
    err "mongodump failed:"
    cat /tmp/db-upgrade-dump.err >&2
    return 1
  fi
  docker cp "$name:/tmp/db-upgrade-dump.archive.gz" "$dest" >/dev/null 2>&1
  docker exec "$name" rm -f /tmp/db-upgrade-dump.archive.gz >/dev/null 2>&1 || true
  [[ -s "$dest" ]]
}

# Restores archive $1 into container $2 (must already be running).
restore_into_container() {
  local archive="$1" name="$2"
  docker cp "$archive" "$name:/tmp/db-upgrade-dump.archive.gz" >/dev/null 2>&1
  docker exec "$name" mongorestore --archive=/tmp/db-upgrade-dump.archive.gz --gzip \
    >/dev/null 2>/tmp/db-upgrade-restore.err
  local rc=$?
  docker exec "$name" rm -f /tmp/db-upgrade-dump.archive.gz >/dev/null 2>&1 || true
  if [[ $rc -ne 0 ]]; then
    err "mongorestore failed:"
    cat /tmp/db-upgrade-restore.err >&2
    return 1
  fi
  return 0
}

acquire_lock() {
  if ! (set -o noclobber; echo "$$" > "$LOCK_FILE") 2>/dev/null; then
    local pid; pid="$(cat "$LOCK_FILE" 2>/dev/null || echo unknown)"
    err "Another db-upgrade.sh run appears to be in progress (lock held by pid $pid: $LOCK_FILE)."
    err "If that's not the case, remove the lock file and retry: rm \"$LOCK_FILE\""
    exit 1
  fi
  trap 'rm -f "$LOCK_FILE"' EXIT
}

# Builds and verifies a fresh mongo:$TARGET data directory at $2 (a
# sibling of the eventual --data-dir, so the final install is a same-
# filesystem rename) by restoring $1 into it. Returns 0 and leaves the
# directory in place on success; on failure, removes it and returns 1.
build_target_data_dir() {
  local archive="$1" new_dir="$2" expected_summary="${3:-}"
  mkdir -p "$new_dir"
  if ! start_tmp_container "$TARGET" "$new_dir" || ! wait_for_ready_or_exit "$TMP_CONTAINER" 120; then
    err "Could not start a fresh mongo:$TARGET instance to restore into."
    stop_tmp_container
    rm -rf "$new_dir"
    return 1
  fi
  if ! restore_into_container "$archive" "$TMP_CONTAINER"; then
    stop_tmp_container
    rm -rf "$new_dir"
    return 1
  fi
  if [[ -n "$expected_summary" ]]; then
    local actual_summary
    actual_summary="$(collection_summary "$TMP_CONTAINER" "$DB_NAME")"
    if [[ "$actual_summary" != "$expected_summary" ]]; then
      err "Verification failed: restored data doesn't match the source."
      err "  source:   $expected_summary"
      err "  restored: $actual_summary"
      stop_tmp_container
      rm -rf "$new_dir"
      return 1
    fi
    log "Verified: restored collection/document counts match the source ($actual_summary)."
  fi
  stop_tmp_container
  return 0
}

do_restore() {
  require_docker
  local abs_dir
  abs_dir="$(resolve_abs_dir "$DATA_DIR")" || { err "Invalid data directory path: $DATA_DIR"; exit 1; }

  if [[ ! -f "$RESTORE_ARCHIVE" ]]; then
    err "Archive file not found: $RESTORE_ARCHIVE"
    exit 1
  fi
  if ! gzip -t "$RESTORE_ARCHIVE" >/dev/null 2>&1; then
    err "Archive failed integrity check: $RESTORE_ARCHIVE"
    exit 1
  fi

  local new_dir="${abs_dir}.newdata-$(date -u +%Y%m%dT%H%M%SZ)"
  log "Restoring $RESTORE_ARCHIVE into a fresh mongo:$TARGET instance ..."
  build_target_data_dir "$(cd "$(dirname "$RESTORE_ARCHIVE")" && pwd)/$(basename "$RESTORE_ARCHIVE")" "$new_dir" || {
    err "Restore failed. $DATA_DIR has not been touched."
    exit 1
  }

  local bound
  bound="$(find_bound_container "$abs_dir")" || true
  if [[ -n "${bound:-}" ]]; then
    stop_bound_container_with_confirmation "$bound"
  fi

  log "This will replace the current contents of $DATA_DIR with the restored data."
  if [[ $ASSUME_YES -eq 0 ]]; then
    read -r -p "Proceed? [y/N] " REPLY
    [[ "$REPLY" =~ ^[Yy]$ ]] || { log "Aborted."; rm -rf "$new_dir"; exit 1; }
  fi

  local sidecar=""
  if [[ -d "$abs_dir" ]]; then
    sidecar="${abs_dir}.pre-restore-$(date -u +%Y%m%dT%H%M%SZ)"
    mv "$abs_dir" "$sidecar"
  fi
  mv "$new_dir" "$abs_dir"

  log "Restore complete. Data restored from: $RESTORE_ARCHIVE"
  if [[ -n "$sidecar" ]]; then
    log "Your previous data was moved aside to: $sidecar"
    log "Once you've confirmed the restore is correct, it's safe to delete that directory."
  fi
}

main() {
  if [[ -n "$RESTORE_ARCHIVE" ]]; then
    do_restore
    exit $?
  fi

  require_docker

  local abs_dir
  abs_dir="$(resolve_abs_dir "$DATA_DIR")" || { err "Data directory not found: $DATA_DIR"; exit 1; }

  if ! looks_like_existing_data "$abs_dir"; then
    log "No existing MongoDB data found in $DATA_DIR."
    log "Nothing to move -- you can start mongo:$TARGET directly."
    exit 0
  fi

  local bound
  bound="$(find_bound_container "$abs_dir")" || true

  local dump_source="" started_reader=0
  if [[ -n "${bound:-}" ]]; then
    dump_source="$bound"
    log "Using the already-running container bound to $DATA_DIR as the dump source (it does not need to be stopped for this step)."
  else
    log "Detecting current MongoDB data version in $DATA_DIR ..."
    local ver
    ver="$(detect_current_version "$abs_dir")" || {
      err "Could not determine the current MongoDB version of the data in $DATA_DIR."
      err "Nothing has been changed."
      exit 1
    }
    log "Detected current version: $ver. Starting a temporary instance to read from ..."
    if ! start_tmp_container "$ver" "$abs_dir" || ! wait_for_ready_or_exit "$TMP_CONTAINER" 120; then
      err "Could not start mongo:$ver against $DATA_DIR."
      stop_tmp_container
      exit 1
    fi
    dump_source="$TMP_CONTAINER"
    started_reader=1
  fi

  mkdir -p "$SCRIPT_DIR/backups"
  local ts archive
  ts="$(date -u +%Y%m%dT%H%M%SZ)"
  archive="$SCRIPT_DIR/backups/ca-mongo-dump-${ts}.archive.gz"

  log "Dumping database '$DB_NAME' ..."
  local source_summary
  source_summary="$(collection_summary "$dump_source" "$DB_NAME")"
  if ! dump_from_container "$dump_source" "$archive"; then
    [[ $started_reader -eq 1 ]] && stop_tmp_container
    err "Dump failed. Nothing has been changed."
    rm -f "$archive"
    exit 1
  fi
  log "Dump written to: $archive"
  [[ $started_reader -eq 1 ]] && stop_tmp_container

  local new_dir="${abs_dir}.newdata-${ts}"
  log "Restoring into a fresh mongo:$TARGET instance for verification ..."
  if ! build_target_data_dir "$archive" "$new_dir" "$source_summary"; then
    err "The upgrade has been aborted before touching $DATA_DIR."
    log "Your original data is untouched. The dump is still saved at: $archive"
    exit 1
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    log "(dry run: verification succeeded, but not installing -- cleaning up)"
    rm -rf "$new_dir"
    rm -f "$archive"
    exit 0
  fi

  if [[ -n "${bound:-}" ]]; then
    stop_bound_container_with_confirmation "$bound"
  fi

  if [[ $ASSUME_YES -eq 0 ]]; then
    log "About to install the verified mongo:$TARGET data in place of $DATA_DIR."
    read -r -p "Proceed? [y/N] " REPLY
    if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
      log "Aborted. Your original data is untouched. Verified upgrade data is at: $new_dir"
      log "The dump is saved at: $archive"
      exit 1
    fi
  fi

  acquire_lock

  local sidecar="${abs_dir}.pre-upgrade-${ts}"
  mv "$abs_dir" "$sidecar"
  mv "$new_dir" "$abs_dir"

  log "========================================================================"
  log "MongoDB data directory upgraded successfully to $TARGET."
  log "Your pre-upgrade data is preserved (untouched) at: $sidecar"
  log "A portable dump of it is also saved at: $archive"
  log "Neither has been deleted. Once you've confirmed the app works correctly"
  log "against mongo:$TARGET, it is safe to remove them."
  log ""
  log "*** IMPORTANT COMPATIBILITY CAVEAT ***"
  log "The caracal backend (github.com/camicroscope/caracal), which performs all"
  log "Mongo queries for this app, pins \"mongodb\": \"^3.6.6\" -- a ~2020-era"
  log "Node.js MongoDB driver whose documented/tested server-compatibility range"
  log "does not officially extend to MongoDB $TARGET. Test the application"
  log "thoroughly before considering this upgrade done. If you hit driver/server"
  log "issues, you can restore from the dump at $archive into an earlier target"
  log "version (--restore \"$archive\" --target 6.0, for example)."
  log "========================================================================"
}

main
