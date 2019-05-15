import graphene

from models import PhaseEnumGraphene
from utils.ordering import OrderedList
from .case import CaseTypeGrapheneEnum, DeleteCase, ImportCase, Case, resolve_case, resolve_case_types
from .field import Field as FieldType, AddField, resolve_fields
from .role import AssignRole, resolve_role, Role
from .tasks import Task, resolve_tasks
from .user import CreateUser
from .volumetrics import VolumetricsType, resolve_volumetrics


class Query(graphene.ObjectType):
    tasks = graphene.List(Task, user=graphene.String(), hours=graphene.Int(), resolver=resolve_tasks)

    fields = OrderedList(FieldType, name=graphene.String(), resolver=resolve_fields)

    case_types = graphene.List(CaseTypeGrapheneEnum, resolver=resolve_case_types)

    case = graphene.Field(Case, case_id=graphene.Int(), resolver=resolve_case)

    role = graphene.List(Role, user=graphene.String(), resolver=resolve_role)

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


schema = graphene.Schema(query=Query, mutation=Mutations)
