#!/usr/bin/env bash
kubectl create secret generic camic-jwt-keys --from-file=key=../jwt_keys/key --from-file=key.pub=../jwt_keys/key.pub
kubectl create configmap pathdb-sites --from-file=../config/pathdb
kubectl create configmap pathdb-config --from-file=../config/ --from-file=httpd.conf=../config/httpd.conf.template
