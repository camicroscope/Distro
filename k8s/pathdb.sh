#!/usr/bin/env sh
kubectl apply -f pathdb/back-claim0-persistentvolumeclaim.yaml,\
pathdb/back-claim1-persistentvolumeclaim.yaml,\
pathdb/back-deployment.yaml,\
pathdb/back-service.yaml,\
pathdb/heatmaploader-claim0-persistentvolumeclaim.yaml,\
pathdb/heatmaploader-deployment.yaml,\
pathdb/idxmongo-claim0-persistentvolumeclaim.yaml,\
pathdb/idxmongo-deployment.yaml,\
pathdb/iip-claim0-persistentvolumeclaim.yaml,\
pathdb/iip-deployment.yaml,\
pathdb/imageloader-claim0-persistentvolumeclaim.yaml,\
pathdb/imageloader-claim1-persistentvolumeclaim.yaml,\
pathdb/imageloader-deployment.yaml,\
pathdb/mongo-claim0-persistentvolumeclaim.yaml,\
pathdb/mongo-deployment.yaml,\
pathdb/pathdb-claim0-persistentvolumeclaim.yaml,\
pathdb/pathdb-claim1-persistentvolumeclaim.yaml,\
pathdb/pathdb-claim2-persistentvolumeclaim.yaml,\
pathdb/pathdb-claim3-persistentvolumeclaim.yaml,\
pathdb/pathdb-claim4-persistentvolumeclaim.yaml,\
pathdb/pathdb-deployment.yaml,\
pathdb/pathdb-service.yaml,\
pathdb/segloader-claim0-persistentvolumeclaim.yaml,\
pathdb/segloader-deployment.yaml,\
