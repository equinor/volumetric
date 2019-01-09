from graphql import GraphQLError
from rq import get_current_job

from models import db, Task
from utils.debug.remote import enable_remote_debugging
from utils.graphql.fileformat import FileFormat
from .custom import import_custom_case
from .fmu import import_fmu_case, validate_fmu_case


def get_validate_func(file_format):
    file_format = FileFormat(file_format)
    if file_format == FileFormat.FMU:
        return validate_fmu_case
    elif file_format == FileFormat.CUSTOM:
        return lambda x: (True, 'Always true')  # TODO: validate CUSTOM format
    else:
        return None


def validate_import(filename, file_format):
    validate_func = get_validate_func(file_format)
    return validate_func(filename) if validate_func else (False, 'Unsupported import file format')


def get_import_func(file_format):
    file_format = FileFormat(file_format)
    if file_format == FileFormat.FMU:
        return import_fmu_case
    elif file_format == FileFormat.CUSTOM:
        return import_custom_case
    else:
        raise GraphQLError('Unsupported file type')


def import_case(filename, field_name, case_name, file_format, **kwargs):
    """
    Import a file containing a single model
    :param file_format: the format of the data in file
    :param case_name: optional case name, read from file if not provided
    :param filename: path to file
    :param field_name: the name of the field that the model is based on
    """

    job = get_current_job()
    task = db.session.query(Task).get(job.id)
    # TODO: register task as started

    enable_remote_debugging()

    try:
        import_func = get_import_func(file_format)
        with db.session.begin_nested():  # SAVEPOINT, rollback and commit handled by context manager (with statement)
            import_func(filename, field_name, case_name, **kwargs)

        task.failed = False
        task.complete = True
        db.session.commit()
    except:
        task.failed = True
        task.complete = True
        db.session.commit()
