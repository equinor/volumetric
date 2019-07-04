FROM node:10-alpine

ARG UID=1000
ARG GID=1000
RUN deluser --remove-home node \
 && addgroup -S volumetric -g $GID \
 && adduser -u $UID -G volumetric -S volumetric \
 && mkdir /code \
 && chown volumetric:volumetric /code

USER volumetric
WORKDIR /code

COPY --chown=volumetric:volumetric package.json yarn.lock ./
ENV PATH=$PATH:/code/node_modules/.bin
RUN yarn --pure-lockfile

COPY --chown=volumetric:volumetric . ./

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
