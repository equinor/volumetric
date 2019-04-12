from datetime import datetime, timedelta

import graphene
from graphql import GraphQLError
from sqlalchemy import desc

from models import Field as FieldModel, Task as TaskModel, PhaseEnumGraphene, Case as CaseModel
from services.database_service import DatabaseService
from utils.ordering import ordered_case, OrderedList
from .case import CaseTypeGrapheneEnum, DeleteCase, ImportCase, Case
from .field import Field as FieldType, AddField
from .types import VolumetricsType, Task


class Query(graphene.ObjectType):
    @ordered_case
    def resolve_fields(self, info, **kwargs):
        user = info.context.user
        fields = FieldModel.query.filter_by(**kwargs).all()
        # Return all fields if user is Admin
        if user.isAdmin:
            return fields

        field_types = []
        for field in fields:
            field_type = FieldType()
            field_type.name = field.name
            # Return only official and personal fields if user not an administrator
            field_type.cases = [case for case in field.cases if case.created_user == user.shortname or case.is_official]
            if len(field_type.cases) > 0:
                field_types.append(field_type)
        return field_types

    def resolve_volumetrics(self, info, case_id, phase, **kwargs):
        user = info.context.user
        case = CaseModel.query.filter(CaseModel.id == case_id).first()

        # Return only personal or official data if user is not administrator
        if not (user.isAdmin or case.is_official or case.created_user == user.shortname):
            raise GraphQLError('You are not authorized to view this case.')

        filtered_kwargs = {k: v for k, v in kwargs.items() if None not in v}
        # Open for improvements
        if not filtered_kwargs and not case_id:
            raise GraphQLError('This query requires 1-4 filters.')

        summed_volumetrics = DatabaseService.get_summed_volumetrics(case_id, filtered_kwargs, phase)
        summed_volumetrics = sorted(summed_volumetrics, key=lambda volumetric: volumetric.realization)

        return VolumetricsType(
            case_id=case_id,
            zone_names=kwargs.get('zone_names'),
            region_names=kwargs.get('region_names'),
            facies_names=kwargs.get('facies_names'),
            summed_volumetrics=summed_volumetrics,
        )

    def resolve_case(self, info, case_id):
        user = info.context.user
        case = CaseModel.query.filter(CaseModel.id == case_id).first()

        # Return only personal or official data if user is not administrator
        if not (user.isAdmin or case.is_official or case.created_user == user.shortname):
            raise GraphQLError('You are not authorized to view this case.')

        return [case]

    def resolve_case_types(self, info):
        # No fine grained auth
        return [CaseTypeGrapheneEnum.FULL_FIELD, CaseTypeGrapheneEnum.SEGMENT]

    def resolve_tasks(self, info, user, hours=None):
        authenticated_user = info.context.user

        # Return only personal data if user is not administrator
        if not (authenticated_user.isAdmin or authenticated_user.shortname == user):
            raise GraphQLError('You are not authorized to view this data.')

        tasks_query = TaskModel.query.filter(TaskModel.user == user).order_by(desc(TaskModel.queued_at))

        if hours is not None:
            tasks_query = tasks_query.filter(TaskModel.queued_at >= (datetime.now() - timedelta(hours=hours)))

        return tasks_query.all()

    tasks = graphene.List(Task, user=graphene.String(), hours=graphene.Int())

    fields = OrderedList(FieldType, name=graphene.String())

    case_types = graphene.List(CaseTypeGrapheneEnum)

    case = graphene.List(Case, case_id=graphene.Int())

    volumetrics = graphene.Field(
        VolumetricsType,
        facies_names=graphene.List(graphene.String),
        region_names=graphene.List(graphene.String),
        zone_names=graphene.List(graphene.String),
        phase=graphene.Argument(PhaseEnumGraphene),
        case_id=graphene.Int())


class Mutations(graphene.ObjectType):
    add_field = AddField.Field()
    import_case = ImportCase.Field()
    delete_case = DeleteCase.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
