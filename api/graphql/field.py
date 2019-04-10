import graphene
from graphql import GraphQLError

from models import db, Field as FieldModel
from utils.ordering import OrderedList, ordered_case
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
        # Only creators are allowed to create new fields
        if not info.context.user.isCreator:
            raise GraphQLError('You are not allowed to create fields!')

        field = FieldModel(name=name)
        db.session.add(field)
        db.session.commit()
        ok = True
        return AddField(field=field, ok=ok)
