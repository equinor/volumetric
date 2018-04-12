FROM python:3.6-alpine3.7

ENV PYTHONUNBUFFERED 1

ADD ./requirements.txt /
RUN apk update && apk add curl bind-tools net-tools bash
RUN pip3 install --no-cache-dir -r requirements.txt
ADD app.py /
EXPOSE 80
ENTRYPOINT ["python3", "./app.py"]
