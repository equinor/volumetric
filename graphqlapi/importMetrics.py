import graphene
import os
from flask import current_app
from graphql import GraphQLError

from graphqlapi.types import CaseTypeGrapheneEnum
from utils.graphql.fileformat import FileFormat
from .field import Field as FieldType
from models import Field as FieldModel, db

from import_data import import_case


class ImportCase(graphene.Mutation):
    class Arguments:
        filename = graphene.String(required=True)
        file_format = FileFormat(default_value=FileFormat.FMU)
        field = graphene.String(required=True)
        case = graphene.String(required=True)
        case_version = graphene.String(required=True)
        case_type = CaseTypeGrapheneEnum(required=True)
        description = graphene.String()
        is_official = graphene.Boolean(default_value=False)
        official_from_date = graphene.DateTime()
        official_to_date = graphene.DateTime()

    ok = graphene.Boolean()
    field = graphene.Field(FieldType)

    def mutate(self, info, filename, file_format, field, case, **kwargs):
        if not info.context.user.isCreator:
            raise GraphQLError('You need to be a creator to import cases!')

        if kwargs['is_official'] and not info.context.user.isAdmin:
            raise GraphQLError('You need to be an admin to import official cases!')

        if not kwargs['is_official']:
            del kwargs['official_from_date']
            del kwargs['official_to_date']

        filepath = os.path.join(current_app.instance_path, current_app.config.get('UPLOAD_FOLDER'), filename)
        import_case(
            filepath,
            field_name=field,
            case_name=case,
            file_format=file_format,
            created_user=info.context.user.shortname,
            **kwargs)
        field_model = db.session.query(FieldModel).filter(FieldModel.name == field).first()
        ok = True
        return ImportCase(ok=ok, field=field_model)
