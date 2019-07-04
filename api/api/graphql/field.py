import graphene
from graphql import GraphQLError
from sqlalchemy import exc

from api.graphql.role import Role
from models import db, Field as FieldModel, Role as RoleModel
from utils.ordering import ordered_case, OrderedList
from .case import Case
from .validation_error import ValidationError


class Field(graphene.ObjectType):
    name = graphene.String()
    cases = OrderedList(Case)

    @ordered_case
    def resolve_cases(self, info):
        return self.cases


class AddField(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    field = graphene.Field(lambda: Field)
    roles = graphene.List(Role)
    error = graphene.Field(ValidationError)

    def mutate(self, info, name):
        user = info.context.user
        # Only admins are allowed to create new fields
        if not user.isAdmin:
            raise GraphQLError('Unauthorized')
        try:
            field = FieldModel(name=name)
            role = RoleModel(user=user.shortname, role="fieldadmin", field=name)
            db.session.add(field)
            db.session.flush()
            db.session.add(role)
            db.session.commit()
        except exc.IntegrityError:
            return AddField(field=Field(name=name), error=ValidationError(id=1, message='The field already exists'))
        roles = RoleModel.query.filter(RoleModel.user == user.shortname)
        return AddField(field=Field(name=name), roles=roles, error=ValidationError(id=0, message=''))
