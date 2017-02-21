# Goal of this guide

The goal of this guide is to be able to install all of caMicroscope components using docker containers. This guide will also guide you how to upload an image, its markups and see them in caMicroscope viewer. 

# Architecture
![camicroscope architecture](https://wiki.nci.nih.gov/download/attachments/325550279/caMicroscope-Architecture.png?version=1&modificationDate=1468862245000&api=v2)

# Requirements
### Hardware
Make sure you have > 15 GB disk space.

### Software
Please make sure you have `docker` and `git` installed. Docker needs to run without sudo.

# Build and run all 3 docker containers
* `./install.sh` will run the 3 containers in default configuration


# Configuring viewer to use Data container.
Login to the viewer container ([How?](http://stackoverflow.com/questions/30172605/how-to-get-into-a-docker-container)), edit `/var/www/html/camicroscope/api/Configuration/config.php` to set the `$baseUrl` to the IP of dataDockerContainer.

# Loading image
Let's download a test image from Openslide (openslide.org — a C++ library that is used by caMicroscope to help read the proprietary image formats.). Go to http://openslide.cs.cmu.edu/download/openslide-testdata/Aperio/ and download CMU-1.svs to your home directory. To view this image in caMicroscope you'll need to load the image through caMicroscope data loader.

### Post Image 
`curl -v -F case_id=CMU1 -F file_location=@CMU-1.svs http://localhost:6002/submitData`
Please note the @ is important.

or go to

`http://localhost:6002` in your browser to use the uploader UI.

You should get a success message.

# Viewing image
Open `http://localhost:1337/camicroscope/osdCamicroscope.php?tissueId=CMU1` to view the image. Please note the `tissueId` parameter is the `case_id` you supplied while loading the image



Part 2 of this guide will focus on installing dynamic services to run segmentation algorithms and view results on the loaded image.

----


# Dynamic services components

* Install and run [OSS-Lite](https://github.com/camicroscope/oss-lite) container: `docker run -itd -p 5000:5000 -v $CAMIC_IMAGES_DIR:/data/images oss-lite`
* Install and run [Ordering Service](https://github.com/camicroscope/OrderingService)
* Install and run [Dynamic Services](https://github.com/camicroscope/DynamicServices)
* Configure dynamic services

```
{
    "orders":
    {
        "redis":
        {
            "host": "172.17.0.5",
            "port": "6379",
            "channel": "q:events"
        },
        "kue":
        {
            "host": "172.17.0.5",
            "port": "3000",
            "path": "/job/"
        }
    },
    "images":
    {
        "location":
        {
            "host" : "172.17.0.2",
            "port" : "9099" ,
            "path" : "/services/Camicroscope_DataLoader/DataLoader/query/getFileLocationByIID"
        },
        "imageServer":
        {
            "url":"172.17.0.6:5000",
            "format":"JPEG"
        },
        "api_key_file": "/tmp/DynamicServices/configs/bindaas_apikey.json"
    },
    "annotations":
    {
        "server":
        {
            "host": "172.17.0.3",
            "port": "3001",
            "path": "/submitZipOrder"
        },
        "redis":
        {
            "host": "172.17.0.3",
            "port": "6379",
            "channel": "q:events"
        }
    }
}
```

* `\orders\redis\host`: Set host as IP of Ordering service container
* `\orders\kue\host`: Set host as IP of Ordering service container
* `\annotations\server\host`: Set host as IP of Loader container
* `\annotations\redis\host`: Set host as IP of Loader container
* `\images\location\host`: Set host as IP of Data container
* `\images\location\imageServer\url`: Set as IP address of OSS lite.

You should be able to use dynamic services on [http://localhost:1337/camicroscopeDS/osdCamicroscope.php?tissueId=CMU1](http://localhost:1337/camicroscopeDS/osdCamicroscope.php?tissueId=CMU1)
