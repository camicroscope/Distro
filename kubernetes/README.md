# Kubernetes Version of caMicroscope and quip

Note that the images persistent volume starts empty. Please replace `emptyDir` with an alternate source if required.

## develop and caMicroscope
run `kubectl apply -f develop.yml` to create, cleanup.sh to remove *everything* when done.

When using minikube, run `minikube tunnel` then `minikube service back --url` to get the url.

For instances where security is enabled, after generating keys in 'jwt_keys' and confiuring login.html, run `add_config.sh` or some modification thereof as needed for your configuration.

## quip
TODO
(worried about non-optional config mounts and image mount in particular)
