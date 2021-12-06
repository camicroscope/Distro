#!/bin/bash
kubectl apply -f develop-back-service.yaml,develop-deployment.yaml,develop-iip-service.yaml,develop-load-service.yaml,develop-mongo-service.yaml
