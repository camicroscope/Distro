<h2 align="center">
  <a href="http://camicroscope.org/"><img src="https://avatars2.githubusercontent.com/u/12075069?s=400&v=4" style="background-color:rgba(0,0,0,0);" height=230 alt="camicroscope: a web-based image viewer optimized for large bio-medical image data viewing"></a>
</h2>

# caMicroscope distribution

![Docker Compose Test](https://github.com/camicroscope/distro/actions/workflows/main.yml/badge.svg)
![License](https://img.shields.io/github/license/camicroscope/distro)

run with `docker-compose -f caMicroscope.yml up`

this will build all services and run in the foreground.
Use `docker-compose -f caMicroscope.yml build` to rebuild the services.

Once everything is up, go to https://localhost/ to see the landing page (a self-signed-certificate warning is expected unless you provide a real certificate, see SSL below). Orthanc's DICOM REST API/GUI is available at https://localhost:8443/.

6GB memory is recommended (in total, 2GB RAM + 4GB swap should work well)

## SSL
`caMicroscope.yml` fronts the whole stack with an nginx reverse proxy (the `proxy` service) that terminates TLS -- `ca-back` and `ca-dicomsrv` are no longer published directly to the host. To enable HTTPS, place your certificate and private key at `certs/certificate.pem` and `certs/privatekey.pem` respectively (this directory is gitignored). nginx will refuse to start without both files present, so for local testing you can generate a self-signed pair, e.g.:

```
openssl req -x509 -newkey rsa:4096 -keyout certs/privatekey.pem -out certs/certificate.pem -days 365 -nodes -subj "/CN=localhost"
```

Other compose variants (`kc_caMicroscope.yml`, `quip-pathdb.yml`) don't include this proxy and keep their own prior SSL setup (mounting certs directly into `ca-back` or configuring `config/httpd.conf`, respectively).

## Component Services
mongo - vanilla mongo container

iip - slide tile server (see https://github.com/camicroscope/iipImage)

loader - extracts metadata needed for image loading (see https://github.com/camicroscope/SlideLoader)

back - security, data, and routing (see https://github.com/camicroscope/caracal)

back/viewer - within back, viewer files ( see https://github.com/camicroscope/caMicroscope)

dicomsrv - Orthanc-based DICOM server/indexer, providing DICOMweb and raw DICOM protocol access to slides (see https://github.com/camicroscope/dicomsrv)

proxy (`caMicroscope.yml` only) - nginx reverse proxy that TLS-terminates and fronts `back` (port 443) and `dicomsrv`'s REST API/GUI (port 8443). The raw DICOM protocol port (11112) is not published by default -- see "DICOM peer connectivity" below if you need it.

## Configuration
Logging - Logging is enabled by default with a set configurable maximum size. If you need to disable logs, for example due to HIPAA requirements, set the logging driver to none.

See backend and security config notes [here](https://github.com/camicroscope/caracal).

Image Volume - This is, by default, the images directory in this directory. If this is changed, please make the same change across all impacted services.

## Upgrading the MongoDB data directory

`caMicroscope.yml`, `kc_caMicroscope.yml`, and `quip-pathdb.yml` run `mongo:8.0` (previously `mongo:4.2-bionic`). MongoDB requires strictly sequential major-version upgrades, so if you have existing data in `./db` from before this change, starting `mongo:8.0` directly against it will fail with an error like:

```
Invalid feature compatibility version value '4.2'; expected '7.0' or '7.3' or '8.0'
```

If you're starting fresh (an empty or missing `./db`), there's nothing to do -- just start the stack normally.

If you have existing data, run `./db-upgrade.sh` from the repo root. Rather than walking the on-disk files through every intermediate MongoDB version in place, it dumps the `camic` database out of wherever it currently lives, restores that dump into a freshly initialized `mongo:8.0` instance built alongside your existing data, and verifies every collection's document count matches before touching anything -- your original `./db` is never modified: it's only renamed aside (as a timestamped sidecar, kept indefinitely) once the new data has already been verified good, and a portable copy of the dump is also kept under `backups/`. Use `./db-upgrade.sh --dry-run` first to run the full dump-restore-verify rehearsal without installing anything, and `./db-upgrade.sh --help` for all options (including `--restore` to rebuild from a saved dump, optionally at a different `--target` version).

**Compatibility caveat:** the `caracal` backend that performs all Mongo queries pins `"mongodb": "^3.6.6"`, a Node.js driver whose officially tested server-compatibility range predates MongoDB 8.0. The dump/restore itself is version-agnostic (it moves BSON documents, not on-disk storage format), but the driver talking to the resulting mongo:8.0 server afterward is running outside its documented range. Test the application thoroughly afterward. If you hit issues, `./db-upgrade.sh --restore <archive> --target 6.0` (or `7.0`) rebuilds the data at an earlier version instead.

`develop.yml` also runs `mongo:8.0` -- if you have existing local dev data from before this change, run `./db-upgrade.sh` (with no `--data-dir` override, since it also points at `./db`) before starting `develop.yml`, the same as for the other compose files.

## Securing caMicroscope

**`caMicroscope.yml` ships with security enabled by default (`DISABLE_SEC` is not set to `"true"`).** This is a behavior change: previously the flagship compose ran with authorization disabled out of the box. Before deploying `caMicroscope.yml`, you must either configure a real identity provider per the instructions below, or switch to `kc_caMicroscope.yml` for a self-contained Keycloak setup. Deploying `caMicroscope.yml` unmodified with no identity provider configured will lock you out of admin/write functionality. (`develop.yml`, used for local development, intentionally keeps `DISABLE_SEC: "true"` and is unaffected.)

### Getting an Identity Provider and Setting up Login

When selecting, an identity provider, note that we expect it to provide a JWT, and to have a certificate/public key/secret which can be used to verify such JWTs.

The example given in the Distro within config/login.html is set up to use google as an identity provider. See [this guide from google](https://developers.google.com/identity/sign-in/web/sign-in) to set up your own project, which is necessary to enable login on your instance.

#### Using Keycloak as a self-contained Identity Provider
Alternatively, you can use kc_caMicroscope.yml for a keycloak configuration.

* Set up Keycloak (covered by docker compose kc_caMicroscope.yml)
    * URL for this is [http://localhost:8080/admin/master/console/#/](http://localhost:8080/admin/master/console/#/), sub host/port as needed
* Set up realm
    * Add realm called ‘camic’
    * All following steps happen in this realm.
* Set up client
    * Clients -> Add Client
    * Set client_id to camicroscope-test.
    * Openid connect with mostly default settings, but **set client authentication to on**
    * Once saved, Under the credentials tab, get the client secret
    * Add the client secret to config/keycloak_login.html for client_secret.
* Add users
    * Users -> add user
    * Make sure to add an email to match user documents in mongo.
    * Set a password under credentials -> add password


The email field is the email field (or failing that, sub field) in that priority from the identity provider.

### DICOM peer connectivity

By default, `caMicroscope.yml` does not publish the raw DICOM protocol port (11112) to the host -- most deployments don't have an external PACS or modality that needs it, and Orthanc (`dicomsrv`) ships with no DICOM-level authentication or TLS of its own. If you do need real DICOM peer connectivity:

1. Re-add `ports: ["11112:11112"]` to the `dicomsrv` service in `caMicroscope.yml`.
2. In `config/OrthancConfiguration.json`, enable `DicomTlsEnabled`, provide `DicomTlsPrivateKey`/`DicomTlsCertificate`, and populate `DicomModalities` with the AE title/IP/port of each trusted peer rather than leaving the `DicomAlwaysAllow*` flags open to everyone.

Note that `config/OrthancConfiguration.json` is shared with `develop.yml` and `kc_caMicroscope.yml` -- changes here affect those too.

## PathDB

To use PathDB, use quip-pathdb.yml instead of caMicroscope.yml.

Running QuIP with PathDB (https://github.com/SBU-BMI/PathDB):

0) place yourself in quip\_distro folder.<br>
1) copy config/httpd.conf.template to config/httpd.conf<br>
2) configure httpd.conf with your certificates to enable https.<br>
3) build with, "docker-compose -f quip-pathdb.yml build"<br>
4) run with, "docker-compose -f quip-pathdb.yml up -d"

The default login for pathdb is `admin` with password `bluecheese2018`. Please change this password before exposing this service to the internet.

## Support and Questions
For questions, comments, or any other discussion, please see the [caMicroscope discussion forum](https://github.com/orgs/camicroscope/discussions).

## System Recommendations
As of 3.8.0, the non-pathdb caMicroscope deployment seems to peak about 500mb of memory per user from basic tests. The system is most likely to work optimally if the CPU can support two or three threads per concurrent user. The containers themselves take up a total of about 6gb of disk, but note that whole slide images typically use 0.5-2 gb of disk each.

## Open Source Development
We have a discussion mailing list! Stop by and discuss all things caMicroscope. https://groups.google.com/forum/#!forum/camicroscope
