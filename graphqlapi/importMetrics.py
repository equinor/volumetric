import graphene
import os
from flask import current_app

from graphqlapi.types import ModelTypeEnum
from .field import Field as FieldType
from models import Field as FieldModel, db

from import_data import import_model


class ImportModel(graphene.Mutation):
    class Arguments:
        filename = graphene.String(required=True)
        field = graphene.String(required=True)
        model = graphene.String(required=True)
        model_version = graphene.String(required=True)
        model_type = ModelTypeEnum(required=True)
        description = graphene.String()
        is_official = graphene.Boolean(default_value=False)
        official_from_date = graphene.DateTime()
        official_to_date = graphene.DateTime()

    ok = graphene.Boolean()
    field = graphene.Field(FieldType)

    def mutate(self, info, filename, field, model, **kwargs):
        filepath = os.path.join(current_app.instance_path, current_app.config.get('UPLOAD_FOLDER'), filename)
        if not kwargs['is_official']:
            del kwargs['official_from_date']
            del kwargs['official_to_date']
        import_model(
            filepath,
            field_name=field,
            model_name=model,
            created_user='anon',  # TODO: set user to authorized user
            **kwargs)
        field_model = db.session.query(FieldModel).filter(FieldModel.name == field).first()
        ok = True
        return ImportModel(ok=ok, field=field_model)
