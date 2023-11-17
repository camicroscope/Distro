<h2 align="center">
  <a href="http://camicroscope.org/"><img src="https://avatars2.githubusercontent.com/u/12075069?s=400&v=4" style="background-color:rgba(0,0,0,0);" height=230 alt="camicroscope: a web-based image viewer optimized for large bio-medical image data viewing"></a>
</h2>

# caMicroscope distribution


run with `docker-compose -f caMicroscope.yml up`

this will build all services and run in the foreground.
Use `docker-compose -f caMicroscope.yml build` to rebuild the services.

Once everything is up, go to http://localhost:4010/ to see the landing page.

6GB memory is recommended (in total, 2GB RAM + 4GB swap should work well)

## SSL
To enable ssl, mount the private key and certificate files to the ca-back service in /root/src/ssl/privatekey.pem and /root/src/ssl/certificate.pem respectively. HTTPS mode will only be enabled if both of these files are present.

## Component Services
mongo - vanilla mongo container

iip - slide tile server (see https://github.com/camicroscope/iipImage)

loader - extracts metadata needed for image loading (see https://github.com/camicroscope/SlideLoader)

back - security, data, and routing (see https://github.com/camicroscope/caracal)

back/viewer - within back, viewer files ( see https://github.com/camicroscope/caMicroscope)

## Configuration
Logging - Logging is enabled by default with a set configurable maximum size. If you need to disable logs, for example due to HIPAA requirements, set the logging driver to none.

See backend and security config notes [here](https://github.com/camicroscope/caracal).

Image Volume - This is, by default, the images directory in this directory. If this is changed, please make the same change across all impacted services.

## Securing caMicroscope

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
