#!/usr/bin/env sh
kubectl apply -f caMicroscope/back-claim0-persistentvolumeclaim.yaml,\
caMicroscope/back-claim1-persistentvolumeclaim.yaml,\
caMicroscope/back-claim2-persistentvolumeclaim.yaml,\
caMicroscope/back-deployment.yaml,\
caMicroscope/back-service.yaml,\
caMicroscope/idxmongo-claim0-persistentvolumeclaim.yaml,\
caMicroscope/idxmongo-deployment.yaml,\
caMicroscope/iip-claim0-persistentvolumeclaim.yaml,\
caMicroscope/iip-deployment.yaml,\
caMicroscope/loader-claim0-persistentvolumeclaim.yaml,\
caMicroscope/loader-deployment.yaml,\
caMicroscope/mongo-claim0-persistentvolumeclaim.yaml,\
caMicroscope/mongo-deployment.yaml
