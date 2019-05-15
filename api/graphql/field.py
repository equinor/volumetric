import graphene
from graphql import GraphQLError

from models import db, Field as FieldModel
from utils.ordering import ordered_case, OrderedList
from .case import Case


class Field(graphene.ObjectType):
    name = graphene.String()
    cases = OrderedList(Case)

    @ordered_case
    def resolve_cases(self, info):
        return self.cases


@ordered_case
def resolve_fields(self, info, **kwargs):
    user = info.context.user
    fields = FieldModel.query.filter_by(**kwargs).all()
    # Return all fields if user is Admin
    if user.isAdmin:
        return fields

    field_types = []
    for field in fields:
        # If the user dont have access to the field, skip.
        if user.roles.get(field.name) is None:
            continue
        field_type = Field()
        field_type.name = field.name
        # Return only official and personal fields if user is not an administrator
        field_type.cases = [case for case in field.cases if case.created_user == user.shortname or case.is_official]
        if len(field_type.cases) > 0:
            field_types.append(field_type)
    return field_types


class AddField(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    ok = graphene.Boolean()
    field = graphene.Field(lambda: Field)

    def mutate(self, info, name):
        user = info.context.user
        # Only admins are allowed to create new fields
        if not user.isAdmin:
            raise GraphQLError('Unauthorized')

        field = FieldModel(name=name)
        db.session.add(field)
        db.session.commit()
        ok = True
        return AddField(field=field, ok=ok)
