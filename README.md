# Goal of this guide [![Build Status](https://travis-ci.org/camicroscope/Distro.svg?branch=camicroscope_release)](https://travis-ci.org/camicroscope/Distro)



The goal of this guide is to be able to install all of caMicroscope components using docker containers. This guide will also guide you how to upload an image, its markups and see them in caMicroscope viewer. 

# Architecture
![camicroscope architecture](https://wiki.nci.nih.gov/download/attachments/325550279/caMicroscope-Architecture.png?version=1&modificationDate=1468862245000&api=v2)

# Requirements
### Hardware
Make sure you have > 15 GB disk space.

### Software
Please make sure you have `docker`(with `docker-compose`) and `git` installed. Docker needs to run without sudo.

# Deploy
Run `docker compose up -d` to start all the containers 



# Customizations

### Where are all the images stored? How can I change it?
All the images and metadata is stored in a docker volume called `camicroscope-images-vol`. To change it define your volume [here in the docker-compose file](https://github.com/camicroscope/Distro/blob/camicroscope_release/docker-compose.yaml#L5). Please note you won't be able to change the volume once the containers are started.

### I already have the images on disk, how can I ingest the metadata in camicroscope to view the images?
See [this](###where-are-all-the-images-stored?-how-can-i-change-it?) to mount the images directory on disk onto the containers. Use ImageLoader.py in the loader container to load metadata from these images.

