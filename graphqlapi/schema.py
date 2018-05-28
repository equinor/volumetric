import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import Model as ModelModel


class Model(SQLAlchemyObjectType):
    class Meta:
        model = ModelModel
        interfaces = (relay.Node, )


class Query(graphene.ObjectType):
    hello = graphene.String()

    def resolve_hello(self, info):
        return 'Hello world!'

    all_metrics = SQLAlchemyConnectionField(Model)


schema = graphene.Schema(query=Query)
