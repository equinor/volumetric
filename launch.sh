#! /bin/bash
docker rm -f vlmtrc-api
docker build -t vlmtrc-api .
docker-compose up