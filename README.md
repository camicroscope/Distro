<h2 align="center">
  <a href="http://camicroscope.org/"><img src="https://avatars2.githubusercontent.com/u/12075069?s=400&v=4" style="background-color:rgba(0,0,0,0);" height=230 alt="camicroscope: a web-based image viewer optimized for large bio-medical image data viewing"></a>
</h2>

[![Build Status](https://travis-ci.org/camicroscope/Distro.svg?branch=master)](https://travis-ci.org/camicroscope/Distro)

# caMicroscope distribution

run with `docker-compose -f caMicroscope.yml up`

this will build all services and run in the foreground.
Use `docker-compose -f caMicroscope.yml build` to rebuild the services.

Once everything is up, go to <the host this is running on>:4010/ to see the landing page.

To use docker-compose and run the application, install Docker Desktop Application. <br>
**NOTE for Windows users:** The Docker Desktop Application also need WSL2 so follow the setup for Windows given below to install Docker on Windows 10. 

**Setup for Windows:**
1. Install Windows Subsystem for Linux (WSL2) from the link given here: <a href = "https://docs.microsoft.com/en-us/windows/wsl/install-win10#manual-installation-steps">WSL2</a>, **FOLLOW STEPS 1 to 5 ONLY (Step 6 - Install your Linux distribution of choice IS NOT REQUIRED)** 
2. After completing all the five steps, <a href = "https://hub.docker.com/editions/community/docker-ce-desktop-windows/">Install Docker Desktop for Windows</a>, click on the "Get Docker" button on the right and run the "Docker Desktop Installer" to complete the installation.

# Fast Local Changes
When using the hosted setup, you can have the distribution host the changes from your local. Follow these steps :<br>
1. Clone <a href = "https://github.com/camicroscope/Distro">Distro</a> repository, the <a href = "https://github.com/camicroscope/Caracal">Caracal </a> repository and the <a href = "https://github.com/camicroscope/caMicroscope">caMicroscope </a>repository in the same parent directory.<br>
2. Set the build to build your local changes instead of the hosted git versions by editing the ca-back container section of your **'develop.yml' of Distro repository**. 
3. Replace the build context section with the path to your local caracal folder("../Caracal"), and add - ```../caMicroscope:/src/camicroscope``` to the volumes as shown below.

![developFile](https://user-images.githubusercontent.com/40331239/113511371-158dd780-957d-11eb-8a26-c0f6a3554e72.jpg)

4. Remove this line from **'Dockerfile' in Caracal repository** :
```RUN git clone https://github.com/${fork:-camicroscope}/camicroscope.git --branch=${viewer:-master}```

![dockerFile](https://user-images.githubusercontent.com/40331239/113511379-1e7ea900-957d-11eb-8e07-5710754fd0a5.jpg)

5. Now open cmd and navigate to the distro folder, <br>
6. First use ```docker-compose -f develop.yml build``` to build the application. <br>
7. After building, use ```docker-compose -f develop.yml up``` to run the application. <br>
Use ctrl-c to stop the application.

## SSL
To enable ssl, mount the private key and certificate files to the ca-back service in /root/src/ssl/privatekey.pem and /root/src/ssl/certificate.pem respectively. HTTPS mode will only be enabled if both of these files are present.

## Component Services
mongo - vanilla mongo container

idxMongo - ephemeral container to index mongo (that is, this container is *expected* to exit once it's done its job)

iip - slide tile server (see https://github.com/camicroscope/iipImage)

loader - extracts metadata needed for image loading (see https://github.com/camicroscope/SlideLoader)

back - security, data, and routing (see https://github.com/camicroscope/caracal)

back/viewer - within back, viewer files ( see https://github.com/camicroscope/caMicroscope)

## Configuration
Logging - Container Logging is, for HIPAA reasons, disabled. Feel free to use a different logging engine if desired, especially for development.

See backend and security config notes (here)[https://github.com/camicroscope/caracal]

Image Volume - This is, by default, the images directory in this directory. If this is changed, please make the same change across all impacted services.

## Securing caMicroscope

### Getting an Identity Provider and Setting up Login

When selecting, an identity provider, note that we expect it to provide a JWT, and to have a certificate/public key/secret which can be used to verify such JWTs.

The example given in the Distro within config/login.html is set up to use google as an identity provider. See [this guide from google](https://developers.google.com/identity/sign-in/web/sign-in) to set up your own project, which is necessary to enable login on your instance.

### Adding Users to caMicroscope

Add users as in ./config/add\_users.js. This can be done either by editing this file before bringing up the stack, or by running similar code against the camic database in ca-mongo. Attributes can be added to deny access to routes (e.g. allow only some users to post and delete) and userFilters can be used to change visibility of particular documents.

The email field is the email field (or failing that, sub field) in that priority from the identity provider.

## PathDB

To use PathDB, use quip-pathdb.yml instead of caMicroscope.yml.

Running QuIP with PathDB (https://github.com/SBU-BMI/PathDB):

0) place yourself in quip\_distro folder.<br>
1) copy config/httpd.conf.template to config/httpd.conf<br>
2) configure httpd.conf with your certificates to enable https.<br>
3) build with, "docker-compose -f quip-pathdb.yml build"<br>
4) run with, "docker-compose -f quip-pathdb.yml up -d"

## Support
Feel free to add any support inquiry as a github issue to this repository. Other feedback can be given via [this form](https://docs.google.com/forms/d/e/1FAIpQLScL91LxrpAZjU88GBZP9gmcdgdf8__uNUwhws2lzU6Lr4qNwA/viewform).

## System Recommendations
As of 3.8.0, the non-pathdb caMicroscope deployment seems to peak about 500mb of memory per user from basic tests. The system is most likely to work optimally if the CPU can support two or three threads per concurrent user. The containers themselves take up a total of about 6gb of disk, but note that whole slide images typically use 0.5-2 gb of disk each.

## Open Source Development
We have a discussion mailing list! Stop by and discuss all things caMicroscope. https://groups.google.com/forum/#!forum/camicroscope
