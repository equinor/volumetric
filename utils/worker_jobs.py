from rq import Queue
from rq.job import Job
from redis import Redis
from import_data import import_case
from models import Task, db


redis_conn = Redis('redis', 6379)
queue = Queue(connection=redis_conn)


def import_data_job(filename, **kwargs):
    job = queue.enqueue(import_case, args=(filename,), kwargs={**kwargs}, timeout=180, result_ttl='86400')
    task = Task(id=job.id,
                user=kwargs['created_user'],
                case_name=kwargs['case_name'],
                queued_at=job.enqueued_at)
    db.session.add(task)
    db.session.commit()
    return job


# TODO: Move this to a more suitable location
def update_job_status_in_db(task):
    try:
        job = Job.fetch(id=task.id, connection=redis_conn)
    except:
        print(f"Job {task.id} is no longer in Redis's store'")
        return

    task.id = job.id
    task.complete = job.is_finished
    task.failed = job.is_failed

    return task
