#!/usr/bin/env bash
#
# check-hardening.sh - guards caMicroscope.yml (the flagship production
# compose) against regressing on the auth/secrets hardening decisions
# made for it. Run locally before pushing, or from CI.

set -uo pipefail

FAIL=0

if grep -q 'DISABLE_SEC: "true"' caMicroscope.yml; then
  echo "FAIL: caMicroscope.yml has DISABLE_SEC set to true (the production compose must ship with auth enabled)."
  FAIL=1
fi

if grep -inE '(PASSWORD|SECRET|_KEY):[[:space:]]*"?[^"$]' caMicroscope.yml | grep -v '^\s*#'; then
  echo "FAIL: caMicroscope.yml appears to contain a hardcoded credential."
  FAIL=1
fi

if [[ $FAIL -eq 0 ]]; then
  echo "OK: caMicroscope.yml hardening checks passed."
fi

exit $FAIL
