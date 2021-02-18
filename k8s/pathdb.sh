#!/usr/bin/env sh
kubectl apply -f pathdb/back-deployment.yaml,pathdb/imageloader-deployment.yaml,pathdb/heatmaploader-deployment.yaml,pathdb/mongo-deployment.yaml,pathdb/idxmongo-deployment.yaml,pathdb/pathdb-deployment.yaml,pathdb/iip-deployment.yaml,pathdb/segloader-deployment.yaml
