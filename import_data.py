from graphql import GraphQLError
from sqlalchemy.exc import SQLAlchemyError

from models import db
from utils.graphql.fileformat import FileFormat
from utils.import_formats.custom import import_custom_case
from utils.import_formats.fmu import import_fmu_case


def import_case(filename, field_name, case_name, file_format, **kwargs):
    """
    Import a file containing a single model
    :param file_format: the format of the data in file
    :param case_name: optional case name, read from file if not provided
    :param filename: path to file
    :param field_name: the name of the field that the model is based on
    """

    file_format = FileFormat(file_format)

    try:
        if file_format == FileFormat.FMU:
            import_fmu_case(filename, field_name, case_name, **kwargs)
        elif file_format == FileFormat.CUSTOM:
            import_custom_case(filename, field_name, case_name, **kwargs)
        else:
            raise GraphQLError('Unsupported file type')
    except SQLAlchemyError:
        print('SQLAlchemy error')
        db.session.rollback()
        raise
    except:
        db.session.rollback()
        raise
    finally:
        db.session.close()
