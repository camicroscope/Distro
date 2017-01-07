# Goal of this guide

The goal of this guide is to be able to install all of caMicroscope componenets using docker containers. This guide will also guide you how to upload an image, its markups and see them in caMicroscope viewer. 

# Architecture
![camicroscope architecture](https://wiki.nci.nih.gov/download/attachments/325550279/caMicroscope-Architecture.png?version=1&modificationDate=1468862245000&api=v2)

# Requirements
Please make sure you have `docker` and `git` installed.

# Build and run all 3 docker containers
* `./install.sh` will run the 3 containers in default configuration


# Configuring viewer to use Data container.
Edit `/var/www/html/camicroscope2/api/Configuration/config.php` to set the `$baseUrl` to the IP of dataDockerContainer.

# Loading image
Lets assume you have an image `TCGA-A1-A0SD-01A-01-BS1.svs` on your file system.
To view this image in caMicroscope you'll need to load the image through caMicroscope data loader.

### Post Image 
`curl -v -F case_id=TCGA-A1-A0SD -F file_location=@TCGA-A1-A0SD-01A-01-BS1.svs http://localhost:6002/submitData`
or go to
`http://localhost:6002` in your browser to use the uploader UI.
You should get a success message.

# Viewing image
Open `http://localhost:1337/camicroscope2/osdCamicroscope.php?tissueId=TCGA-A1-A0SD` to view the image. Please note the `tissueId` parameter is the `case_id` you supplied while loading the image


