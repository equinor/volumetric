import graphene
from graphql import GraphQLError

from models import db, Field as FieldModel
from utils.ordering import OrderedList, ordered_case
from api.graphql.types import CaseType


class Field(graphene.ObjectType):
    name = graphene.String()
    cases = OrderedList(CaseType)

    @ordered_case
    def resolve_cases(self, info):
        return self.cases


class AddField(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    ok = graphene.Boolean()
    field = graphene.Field(lambda: Field)

    def mutate(self, info, name):
        if not info.context.user.isCreator:
            raise GraphQLError('You are not allowed to create fields!')

        field = FieldModel(name=name)
        db.session.add(field)
        db.session.commit()
        ok = True
        return AddField(field=field, ok=ok)
