# Goal of this guide

The goal of this guide is to be able to install all of caMicroscope components using docker containers. This guide will also guide you how to upload an image, its markups and see them in caMicroscope viewer. 

# Architecture
![camicroscope architecture](https://wiki.nci.nih.gov/download/attachments/325550279/caMicroscope-Architecture.png?version=1&modificationDate=1468862245000&api=v2)

# Requirements
Please make sure you have `docker` and `git` installed.

# Build and run all 3 docker containers
* `./install.sh` will run the 3 containers in default configuration


# Configuring viewer to use Data container.
Login to the viewer container ([How?](http://stackoverflow.com/questions/30172605/how-to-get-into-a-docker-container)), edit `/var/www/html/camicroscope2/api/Configuration/config.php` to set the `$baseUrl` to the IP of dataDockerContainer.

# Loading image
Let's download a test image from Openslide (openslide.org — a C++ library that is used by caMicroscope to help read the proprietary image formats.). Go to http://openslide.cs.cmu.edu/download/openslide-testdata/Aperio/ and download CMU-1.svs to your home directory. To view this image in caMicroscope you'll need to load the image through caMicroscope data loader.

### Post Image 
`curl -v -F case_id=CMU1 -F file_location=@CMU-1.svs http://localhost:6002/submitData`
Please note the @ is important.

or go to

`http://localhost:6002` in your browser to use the uploader UI.

You should get a success message.

# Viewing image
Open `http://localhost:1337/camicroscope2/osdCamicroscope.php?tissueId=CMU1` to view the image. Please note the `tissueId` parameter is the `case_id` you supplied while loading the image


