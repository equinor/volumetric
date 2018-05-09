import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import Volumetrics as VolumetricsModel


class Volumetrics(SQLAlchemyObjectType):
    class Meta:
        model = VolumetricsModel
        interfaces = (relay.Node, )


class Query(graphene.ObjectType):
    hello = graphene.String()

    def resolve_hello(self, info):
        return 'Hello world!'

    all_metrics = SQLAlchemyConnectionField(Volumetrics)


schema = graphene.Schema(query=Query)
