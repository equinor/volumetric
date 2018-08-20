import graphene
import os
from flask import current_app
from .field import Field as FieldType
from models import Field as FieldModel, db

from import_data import import_model


class ImportModel(graphene.Mutation):
    class Arguments:
        field = graphene.String()
        model = graphene.String()
        filename = graphene.String()

    ok = graphene.Boolean()
    field = graphene.Field(FieldType)

    def mutate(self, info, field, filename, model=None):
        filepath = os.path.join(current_app.instance_path, current_app.config.get('UPLOAD_FOLDER'), filename)
        import_model(filepath, model_name=model, field_name=field)
        field_model = db.session.query(FieldModel).filter(FieldModel.name == field).first()
        ok = True
        return ImportModel(ok=ok, field=field_model)
