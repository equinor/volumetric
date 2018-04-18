FROM node:8.11.1-alpine

ARG UID=1000
ARG GID=1000
RUN deluser --remove-home node \
 && addgroup -S volumetric -g $GID \
 && adduser -u $UID -G volumetric -S volumetric \
 && mkdir /code \
 && chown volumetric:volumetric /code

WORKDIR /code

USER volumetric

COPY --chown=volumetric:volumetric package.json package-lock.json ./

RUN npm install

COPY --chown=volumetric:volumetric . ./

ENV PATH="/code/node_modules/.bin:${PATH}"

EXPOSE 80