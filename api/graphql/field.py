import graphene
from graphql import GraphQLError

from models import db, Field as FieldModel
from utils.ordering import ordered_case, OrderedList
from .case import Case
from .validation_error import ValidationError


class Field(graphene.ObjectType):
    name = graphene.String()
    cases = OrderedList(Case)

    @ordered_case
    def resolve_cases(self, info):
        return self.cases


def validate_field_creation(name):
    if not FieldModel.query.filter(FieldModel.name == name).first():
        return True


class AddField(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    field = graphene.Field(lambda: Field)
    error = graphene.Field(ValidationError)

    def mutate(self, info, name):
        user = info.context.user
        # Only admins are allowed to create new fields
        if not user.isAdmin:
            raise GraphQLError('Unauthorized')

        if not validate_field_creation(name):
            return AddField(field=Field(name=name), error=ValidationError(id=1, message='The field already exists'))

        field = FieldModel(name=name)
        db.session.add(field)
        db.session.commit()

        return AddField(field=Field(name=name), error=ValidationError(id=0, message=''))
