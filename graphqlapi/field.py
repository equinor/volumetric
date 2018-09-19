import graphene
from graphql import GraphQLError

from models import db, Field as FieldModel
from utils.ordering import OrderedList, ordered_model
from .types import ModelType


class Field(graphene.ObjectType):
    name = graphene.String()
    models = OrderedList(ModelType)

    @ordered_model
    def resolve_models(self, info):
        return self.models


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
