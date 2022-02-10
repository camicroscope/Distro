#!/usr/bin/env bash
kubectl create secret generic camic-jwt-keys --from-file=key=../jwt_keys/key --from-file=key.pub=../jwt_keys/key.pub
kubectl create configmap pathdb-pre --from-file=pathdb_pre.sh=../config/pathdb_pre.sh
kubectl create configmap pathdb-config --from-file=../config/pathdb
