#!/usr/bin/env sh
kubectl apply -f caMicroscope/back-deployment.yaml,caMicroscope/loader-deployment.yaml,caMicroscope/idxmongo-deployment.yaml,caMicroscope/mongo-deployment.yaml,caMicroscope/iip-deployment.yaml
