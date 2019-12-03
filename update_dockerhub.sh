#!/usr/bin/env bash

# need permission
docker login
# build images
docker-compose -f quip-pathdb.yml build
docker-compose -f caMicroscope.yml build
# tag and push images
10064  docker tag distro_bindaas:latest camicroscope/bindaas:latest
10065  docker push camicroscope/bindaas:latest
10068  docker tag distro_viewer:latest camicroscope/viewer:latest
10069  docker push camicroscope/viewer:latest
docker tag distro_security:latest camicroscope/security:latest
10071  docker push camicroscope/security:latest
docker tag distro_auth:latest camicroscope/auth_service:latest
10074  docker push camicroscope/auth_service:latest
docker tag distro_imageloader:latest camicroscope/pathdb-imageloader:latest
docker push camicroscope/pathdb-imageloader:latest
docker tag distro_heatmaploader:latest camicroscope/pathdb-heatmaploader:latest
docker push camicroscope/pathdb-heatmaploader:latest
docker tag distro_segloader:latest camicroscope/pathdb-segloader:latest
docker push camicroscope/pathdb-segloader:latest
docker tag distro_pathdb:latest camicroscope/pathdb:latest
docker push camicroscope/pathdb:latest
# iip and slideloader are done on commit and tag
