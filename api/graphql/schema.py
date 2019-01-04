from datetime import datetime, timedelta

import graphene
from graphql import GraphQLError

from models import Field as FieldModel, Case as CaseModel, Task as TaskModel, db
from services.database_service import DatabaseService
from utils.calculations import sum_volumetrics as calc_sum_volumetrics
from utils.ordering import ordered_case, OrderedList
from utils.worker_jobs import update_job_status_in_db
from .field import Field as FieldType, AddField
from .import_metrics import ImportCase
from .types import VolumetricsType, VolumetricType, CaseTypeGrapheneEnum, TaskType


def sum_volumetrics(volumetrics):
    summed_volumetrics = calc_sum_volumetrics(volumetrics)
    return [VolumetricType(**summed_volumetrics[volumetric_dict]) for volumetric_dict in summed_volumetrics]


class Query(graphene.ObjectType):
    @ordered_case
    def resolve_fields(self, info, **kwargs):
        user = info.context.user
        fields = FieldModel.query.filter_by(**kwargs).all()
        if user.isAdmin:
            return fields

        field_types = []
        for field in fields:
            field_type = FieldType()
            field_type.name = field.name
            field_type.cases = [case for case in field.cases if case.created_user == user.shortname or case.is_official]
            if len(field_type.cases) > 0:
                field_types.append(field_type)
        return field_types

    def resolve_volumetrics(self, info, case_id, **kwargs):
        user = info.context.user
        case = CaseModel.query.filter(CaseModel.id == case_id).first()

        if not (user.isAdmin or case.is_official or case.created_user == user.shortname):
            raise GraphQLError('Forbidden')

        filtered_kwargs = {k: v for k, v in kwargs.items() if None not in v}
        # Open for improvements
        if not filtered_kwargs and not case_id:
            raise GraphQLError('This query requires 1-4 filters.')

        volumetrics = DatabaseService.get_volumetrics(case_id, filtered_kwargs)
        volumetrics = sorted(volumetrics, key=lambda volumetric: volumetric.realization.realization)

        summed_volumetrics = sum_volumetrics(volumetrics)

        return VolumetricsType(
            case_id=case_id,
            zone_names=kwargs.get('zone_names'),
            region_names=kwargs.get('region_names'),
            facies_names=kwargs.get('facies_names'),
            volumetrics=volumetrics,
            summed_volumetrics=summed_volumetrics,
        )

    def resolve_case_types(self, info):
        return [CaseTypeGrapheneEnum.FULL_FIELD, CaseTypeGrapheneEnum.SEGMENT]

    def resolve_tasks(self, info, **kwargs):
        tasks = TaskModel.query.filter(TaskModel.user == kwargs['user']).filter(
            TaskModel.queued_at >= (datetime.now() - timedelta(hours=kwargs['hours']))).all()

        for task in tasks:
            update_job_status_in_db(task)

        db.session.commit()

        return tasks

    tasks = graphene.List(TaskType, user=graphene.String(), hours=graphene.Int())

    fields = OrderedList(FieldType, name=graphene.String())

    case_types = graphene.List(CaseTypeGrapheneEnum)

    volumetrics = graphene.Field(
        VolumetricsType,
        facies_names=graphene.List(graphene.String),
        region_names=graphene.List(graphene.String),
        zone_names=graphene.List(graphene.String),
        case_id=graphene.Int())


class Mutations(graphene.ObjectType):
    add_field = AddField.Field()
    import_case = ImportCase.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
