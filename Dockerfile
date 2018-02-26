FROM python:3.6-alpine3.7

ENV PROXY=http://www-proxy.statoil.no:80
ENV HTTP_PROXY=$PROXY
ENV HTTPS_PROXY=$PROXY
ENV PYTHONUNBUFFERED 1

COPY ./ca-certificates.crt /usr/local/share/ca-certificates/ca-certificates.crt
RUN update-ca-certificates

ADD ./requirements.txt /
RUN apk update && apk add curl bind-tools net-tools bash
RUN pip3 install -r requirements.txt
ADD ./test.py /
ENTRYPOINT ["python3", "./test.py"]
