# Volumetric API

## How to use

Copy the file "secrets.env.template" to "secrets.env" and set the variables in the file.

Then run `docker-compose up -d`

## Database operations

### Alembic operations

The flask-migrate commands can be accessed by executing the manage.py script "db" as arg.

* Create migration script with differences from SQLAlchemy models and db
```
volumetric run --rm api manage db migrate -m "<NAME_OF_SCRIPT>"
```

* Upgrade db to latest revision
```
volumetric run --rm api manage db upgrade
```

## Database

![ERD schema][erd]

[erd]: https://git.statoil.no/volumetric/api/-/jobs/artifacts/master/raw/data/build/schema.png?job=create_erd

## Debug

* [How to setup remote debugging](https://git.statoil.no/CRIS/cris-run/wikis/remote-debugging-in-cris-api)

Make sure to enable remote debugging in config.py

## Troubleshooting

### Certificates

Make sure you have the right certificates in your docker image. 

On docker build, there has to be a `ca-bundle.trust.crt` that contains StatoilLightCA.crt and StatoilRootCA.crt.
