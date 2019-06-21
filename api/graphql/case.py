import graphene
from graphql import GraphQLError

from models import db, Location as LocationModel, CaseTypeEnum, Case as CaseModel
from services.azure_file_service import AzureFilesService
from utils.authentication import is_creator, is_fieldadmin, is_reader
from utils.case_import.import_data import validate_import
from utils.case_import.queue import create_import_data_job
from utils.graphql.fileformat import FileFormat
from utils.ordering import OrderedList, ordered_strings, ordered_case
from .tasks import Task
from .validation_error import ValidationField


@ordered_case
def resolve_cases(self, info, field_name):
    user = info.context.user
    cases = CaseModel.query.filter(CaseModel.field_name == field_name).all()
    # Return all fields if user is Admin
    if user.isAdmin:
        return cases

    if not is_reader(user, field_name):
        raise GraphQLError("You don't have access to this field.")

    # Return only official and personal cases if user is not an administrator
    return [case for case in cases if case.created_user == user.shortname or case.is_shared]


def resolve_case(self, info, case_id):
    user = info.context.user
    case = CaseModel.query.filter(CaseModel.id == case_id).first()

    if user.isAdmin:
        return case

    # Deny if user dont have access to field
    if not is_reader(user, case.field.name):
        raise GraphQLError('You are not authorized to view this case.')
    # Return only personal or official data if user is not administrator
    if not (case.is_shared or case.created_user == user.shortname):
        raise GraphQLError('You are not authorized to view this case.')

    return case


def resolve_case_types(self, info):
    # No fine grained auth
    return [CaseTypeGrapheneEnum.FULL_FIELD, CaseTypeGrapheneEnum.SEGMENT]


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
    is_shared = graphene.Boolean()
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
        user = info.context.user
        case = CaseModel.query.get(id)

        # Only admins and FieldAdmins are allowed to delete official cases.
        if case.is_official and not is_fieldadmin(user, case.field.name):
            return GraphQLError('Unauthorized')
        # Only owners are allowed to delete private cases
        if not case.is_shared and user.shortname != case.created_user:
            return GraphQLError('Unauthorized')

        field = case.field
        db.session.delete(case)
        if len(field.cases) == 0:
            db.session.delete(field)
        db.session.commit()
        ok = True
        return DeleteCase(case=case, ok=ok)


file_format_enum = graphene.Enum.from_enum(FileFormat)


class CaseValidationError(graphene.ObjectType):
    file = graphene.Field(ValidationField)
    version = graphene.Field(ValidationField)
    all_valid = graphene.Boolean()


class ImportCase(graphene.Mutation):
    class Arguments:
        filename = graphene.String(required=True)
        filehash = graphene.String(required=True)
        file_format = file_format_enum(required=True)
        field = graphene.String(required=True)
        case = graphene.String(required=True)
        case_version = graphene.String(required=True)
        case_type = CaseTypeGrapheneEnum(required=True)
        description = graphene.String()
        is_official = graphene.Boolean(default_value=False)
        is_shared = graphene.Boolean(default_value=True)
        official_from_date = graphene.DateTime()
        official_to_date = graphene.DateTime()

    ok = graphene.Boolean()
    validation_error = graphene.Field(CaseValidationError)  # TODO: use graphql errors?
    task = graphene.Field(Task)

    def mutate(self, info, filename, filehash, file_format, field, case, **kwargs):
        user = info.context.user
        if not is_creator(user, field):
            raise GraphQLError('You need to be a creator to import cases')

        if kwargs['is_official'] and not is_fieldadmin(user, field):
            raise GraphQLError('You need to be an field administrator to import official cases')

        if not kwargs['is_official']:
            del kwargs['official_from_date']
            del kwargs['official_to_date']
        else:
            kwargs['is_shared'] = True

        file = AzureFilesService.download_azure_file(filehash)

        version_is_valid = db.session.query(
            CaseModel.id).filter(CaseModel.field_name == field, CaseModel.name == case,
                                 CaseModel.case_version == kwargs['case_version']).scalar() is None

        version_validation = ValidationField(
            valid=version_is_valid, message='This version already exists' if not version_is_valid else '')

        file_is_valid, message = validate_import(file, file_format=file_format)
        file_validation = ValidationField(valid=file_is_valid, message=message)
        validation_error = CaseValidationError(
            file=file_validation, version=version_validation, all_valid=file_is_valid and version_is_valid)

        if file_is_valid and version_is_valid:
            task = create_import_data_job(
                file,
                filename,
                filehash,
                field_name=field,
                case_name=case,
                file_format=file_format,
                created_user=info.context.user.shortname,
                **kwargs)
        else:
            task = None

        ok = True
        return ImportCase(ok=ok, task=task, validation_error=validation_error)
