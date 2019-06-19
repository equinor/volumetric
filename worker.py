from flask import Flask
from redis import Redis
from rq import Connection, Worker
from rq.timeouts import JobTimeoutException
from sqlalchemy.exc import DataError, IntegrityError

from config import Config
from models import db, Task


def rq_error_handler(job, exc_type, exc_value, traceback):
    exception_type = type(exc_value)
    task = db.session.query(Task).get(job.id)
    task.failed = True
    task.complete = False

    if exception_type is JobTimeoutException:
        task.message = f'JobTimeoutException: The job took too long to complete. Exceeded {Config.JOB_TIMEOUT} '
    elif exception_type is DataError:
        task.message = 'DataError: Some data in you file is not of the correct type'
    elif exception_type is IntegrityError:
        task.message = 'IntegrityError: Are you sure all your rows are unique?'
    else:
        try:
            task.message = exc_value.args[0]
        except Exception:
            task.message = 'Something went wrong with the import job'

    db.session.commit()
    return False


def run_worker():
    redis_connection = Redis(app.config['REDIS_URL'])
    with Connection(redis_connection):
        worker = Worker(['default'], exception_handlers=[rq_error_handler])
        worker.work()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app


app = create_app()
with app.app_context():
    run_worker()
