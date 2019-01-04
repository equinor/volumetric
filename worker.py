from flask import Flask
from config import Config
from graphqlapi import create_api
from models import db
from redis import Redis
from rq import Connection, Worker


def run_worker():
    redis_connection = Redis(app.config['REDIS_URL'])
    with Connection(redis_connection):
        worker = Worker('default')
        worker.work()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    create_api(app)

    return app


app = create_app()
with app.app_context():
    run_worker()
