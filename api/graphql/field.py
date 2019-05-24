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
