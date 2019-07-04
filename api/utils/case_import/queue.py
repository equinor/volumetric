from rq import Queue
from redis import Redis
from .import_data import import_case
from models import Task, db
from config import Config

redis_connection = Redis(Config.REDIS_URL, Config.REDIS_PORT)
queue = Queue(connection=redis_connection, default_timeout=Config.JOB_TIMEOUT)


def create_import_data_job(file, filename, filehash, **kwargs):
    job = queue.enqueue(import_case, args=(file, ), kwargs={**kwargs}, timeout=Config.JOB_TIMEOUT, result_ttl='24h')
    task = Task(
        id=job.id,
        user=kwargs['created_user'],
        case_name=kwargs['case_name'],
        field_name=kwargs['field_name'],
        filename=filename,
        filehash=filehash,
        queued_at=job.enqueued_at)
    db.session.add(task)
    db.session.commit()
    return task
