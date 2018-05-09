FROM python:3.6-alpine3.7

# If proxy not set in ~/.docker/config.json, uncomment these lines.
#ENV PROXY=http://www-proxy.statoil.no:80
#ENV HTTP_PROXY=$PROXY
#ENV HTTPS_PROXY=$PROXY
ENV PYTHONUNBUFFERED 1
ENV TZ=Europe/Oslo

# These packages are for development and debugging purposes only.
RUN apk update && apk add --no-cache curl bind-tools net-tools bash
RUN apk add --no-cache postgresql-dev gcc python3-dev musl-dev

ADD ./requirements.txt ./dev-requirements.txt /
RUN pip3 install -U pip && \
    pip3 install --no-cache-dir --requirement requirements.txt && \
    pip3 install --no-cache-dir --requirement dev-requirements.txt

ADD . /code
WORKDIR /code
ENTRYPOINT ["/code/entrypoint.sh"]
CMD ["api"]
