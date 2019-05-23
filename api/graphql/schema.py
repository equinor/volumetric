import graphene

from models import PhaseEnumGraphene
from utils.ordering import OrderedList
from .case import CaseTypeGrapheneEnum, DeleteCase, ImportCase, Case, resolve_case, resolve_case_types
from .field import Field as FieldType, AddField, resolve_fields
from .role import AssignRole, resolve_role_by_user, resolve_role_by_field, Role, DeleteRole
from .tasks import Task, resolve_tasks
from .user import CreateUser
from .volumetrics import VolumetricsType, resolve_volumetrics


class Query(graphene.ObjectType):
    tasks = graphene.List(
        Task, user=graphene.String(), field=graphene.String(), hours=graphene.Int(), resolver=resolve_tasks)
    fields = OrderedList(FieldType, name=graphene.String(), resolver=resolve_fields)
    case_types = graphene.List(CaseTypeGrapheneEnum, resolver=resolve_case_types)
    case = graphene.Field(Case, case_id=graphene.Int(), resolver=resolve_case)
    role_by_user = graphene.List(Role, user=graphene.String(), resolver=resolve_role_by_user)
    roles_by_field = graphene.List(Role, field=graphene.String(), resolver=resolve_role_by_field)
    volumetrics = graphene.Field(
        VolumetricsType,
        facies_names=graphene.List(graphene.String),
        region_names=graphene.List(graphene.String),
        zone_names=graphene.List(graphene.String),
        phase=graphene.Argument(PhaseEnumGraphene),
        case_id=graphene.Int(),
        resolver=resolve_volumetrics)


class Mutations(graphene.ObjectType):
    add_field = AddField.Field()
    import_case = ImportCase.Field()
    create_user = CreateUser.Field()
    delete_case = DeleteCase.Field()
    assign_role = AssignRole.Field()
    delete_role = DeleteRole.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
