import os

import graphene
from flask import current_app
from graphql import GraphQLError
from sqlalchemy import func

from models import db, PhaseEnumGraphene, Location as LocationModel, CaseTypeEnum, Volumetrics as VolumetricsModel, \
    Realization as RealizationModel, PhaseEnum, Case as CaseModel
from utils.calculations import METRICS
from utils.case_import.import_data import validate_import
from utils.case_import.queue import create_import_data_job
from utils.graphql.fileformat import FileFormat
from utils.ordering import OrderedList, ordered_strings
from .types import Task


def case_type_description(value):
    if value == CaseTypeEnum.SEGMENT:
        return 'Case describing a segmented part of the field'
    elif value == CaseTypeEnum.FULL_FIELD:
        return 'Case describing the full field'


CaseTypeGrapheneEnum = graphene.Enum.from_enum(CaseTypeEnum, description=lambda value: case_type_description(value))


def get_distinct_location_keys(case_id, entity):
    return LocationModel.query.filter_by(case_id=case_id).with_entities(entity).distinct()


class Case(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    case_version = graphene.String()
    case_type = CaseTypeGrapheneEnum()
    description = graphene.String()
    is_official = graphene.Boolean()
    is_currently_official = graphene.Boolean()
    official_from_date = graphene.DateTime()
    official_to_date = graphene.DateTime()
    created_user = graphene.String()
    created_date = graphene.DateTime()
    field_name = graphene.String()
    regions = OrderedList(graphene.String)
    zones = OrderedList(graphene.String)
    facies = OrderedList(graphene.String)
    phases = OrderedList(graphene.String)
    metrics = OrderedList(graphene.String)

    @ordered_strings
    def resolve_regions(self, info):
        return [region.region_name for region in get_distinct_location_keys(self.id, LocationModel.region_name)]

    @ordered_strings
    def resolve_zones(self, info):
        return [zone.zone_name for zone in get_distinct_location_keys(self.id, LocationModel.zone_name)]

    @ordered_strings
    def resolve_facies(self, info):
        return [facies.facies_name for facies in get_distinct_location_keys(self.id, LocationModel.facies_name)]


class DeleteCase(graphene.Mutation):
    class Arguments:
        id = graphene.Int()

    ok = graphene.Boolean()
    case = graphene.Field(lambda: Case)

    def mutate(self, info, id):
        case = CaseModel.query.get(id)

        user = info.context.user
        # Only admins and FieldAdmins are allowed to delete none private cases.
        if not (user.isAdmin or user.isFieldAdmin or user.shortname == case.created_user):
            return GraphQLError('Unauthorized')

        field = case.field
        db.session.delete(case)
        if len(field.cases) == 0:
            db.session.delete(field)
        db.session.commit()
        ok = True
        return DeleteCase(case=case, ok=ok)


file_format_enum = graphene.Enum.from_enum(FileFormat)


class ValidationError(graphene.ObjectType):
    id = graphene.String()
    message = graphene.String()


class ImportCase(graphene.Mutation):
    class Arguments:
        filename = graphene.String(required=True)
        file_format = file_format_enum(required=True)
        field = graphene.String(required=True)
        case = graphene.String(required=True)
        case_version = graphene.String(required=True)
        case_type = CaseTypeGrapheneEnum(required=True)
        description = graphene.String()
        is_official = graphene.Boolean(default_value=False)
        official_from_date = graphene.DateTime()
        official_to_date = graphene.DateTime()

    ok = graphene.Boolean()
    validation_error = graphene.Field(ValidationError)  # TODO: use graphql errors?
    task = graphene.Field(Task)

    def mutate(self, info, filename, file_format, field, case, **kwargs):
        if not info.context.user.isCreator:
            raise GraphQLError('You need to be a creator to import cases!')

        if kwargs['is_official'] and not info.context.user.isFieldAdmin:
            raise GraphQLError('You need to be an field administrator to import official cases!')

        if not kwargs['is_official']:
            del kwargs['official_from_date']
            del kwargs['official_to_date']

        filepath = os.path.join(current_app.instance_path, current_app.config.get('UPLOAD_FOLDER'), filename)
        is_valid, message = validate_import(filepath, file_format=file_format)

        if is_valid:
            task = create_import_data_job(
                filepath,
                field_name=field,
                case_name=case,
                file_format=file_format,
                created_user=info.context.user.shortname,
                **kwargs)
            validation_error = None
        else:
            task = None
            validation_error = ValidationError(id=1, message=message)

        ok = True
        return ImportCase(ok=ok, task=task, validation_error=validation_error)
