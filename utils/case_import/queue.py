from rq import Queue
from redis import Redis
from .import_data import import_case
from models import Task, db
from config import Config

redis_connection = Redis(Config.REDIS_URL, Config.REDIS_PORT)
queue = Queue(connection=redis_connection)


def create_import_data_job(filename, **kwargs):
    job = queue.enqueue(import_case, args=(filename, ), kwargs={**kwargs}, timeout=180, result_ttl='86400')
    task = Task(id=job.id, user=kwargs['created_user'], case_name=kwargs['case_name'], queued_at=job.enqueued_at)
    db.session.add(task)
    db.session.commit()
    return task
