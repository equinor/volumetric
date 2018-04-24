# How to
Copy the file "secrets.env.template" to "secrets.env" and set the variables in the file.

Make sure you have the right certificates in your dockerimage. 
On docker build, there has to be a cert-bundle containing StatoilLightCA.crt and StatoilRootCA.crt on the build-root.

Then run docker-compose up -d

## Debug

* [Remote debug setup](https://git.statoil.no/CRIS/cris-run/wikis/remote-debugging-in-cris-api)

NOTE: Make sure to enable remote debugging in config.py
