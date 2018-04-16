#! /bin/bash
#docker rm -f vlmtrc/api
docker build -t git.statoil.no:4567/volumetric/api .
docker-compose up