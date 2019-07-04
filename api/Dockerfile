FROM python:3.6-alpine3.7
ARG UID=1000
ARG GID=1000
ENV PYTHONUNBUFFERED=1 \
    TZ=Europe/Oslo \
    FLASK_APP=app.py \
    FLASK_RUN_PORT=8080 \
    FLASK_RUN_HOST=0.0.0.0
RUN addgroup -S volumetric -g $GID \
    && adduser -u $UID -G volumetric -S volumetric
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev libffi-dev \
    && pip install -U pip pipenv
WORKDIR /code
RUN chown -R volumetric:volumetric /code
COPY --chown=volumetric:volumetric Pipfile Pipfile.lock ./
RUN pipenv install --system --deploy --dev --clear
COPY --chown=volumetric:volumetric . ./
USER volumetric
ENTRYPOINT ["/code/entrypoint.sh"]
CMD ["api"]
