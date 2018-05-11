FROM python:3.6-alpine3.7

ARG UID=1000
ARG GID=1000
RUN addgroup -S volumetric -g $GID \
 && adduser -u $UID -G volumetric -S volumetric \
 && mkdir /code \
 && chown volumetric:volumetric /code

# If proxy not set in ~/.docker/config.json, uncomment these lines.
#ENV PROXY=http://www-proxy.statoil.no:80
#ENV HTTP_PROXY=$PROXY
#ENV HTTPS_PROXY=$PROXY
ENV PYTHONUNBUFFERED=1 TZ=Europe/Oslo

# These packages are for development and debugging purposes only.
RUN apk update && apk add --no-cache curl bind-tools net-tools bash
RUN apk add --no-cache postgresql-dev gcc python3-dev musl-dev

ENV PATH="/home/volumetric/.local/bin:${PATH}"
COPY --chown=volumetric:volumetric Pipfile Pipfile.lock ./
RUN pip3 install -U pip pipenv && \
    pipenv install --system --deploy --dev

USER volumetric
WORKDIR /code

ENV FLASK_APP=app.py FLASK_RUN_PORT=8080 FLASK_RUN_HOST=0.0.0.0
COPY --chown=volumetric:volumetric . ./
ENTRYPOINT ["/code/entrypoint.sh"]
CMD ["api"]
