# Kubernetes Version of caMicroscope and quip

Note that the images persistent volume starts empty. Please replace `emptyDir` with an alternate source if required.

## develop and caMicroscope
run `kubectl apply -f develop.yml` to create, cleanup.sh to remove *everything* when done.

When using minikube, run `minikube tunnel` then `minikube service back --url` to get the url.

For instances where security is enabled, after generating keys in 'jwt_keys', run `kubectl create secret generic camic-jwt-keys --from-file=key=../jwt_keys/key --from-file=key.pub=../jwt_keys/key.pub`

## quip
TODO
(worried about non-optional config mounts and image mount in particular)
