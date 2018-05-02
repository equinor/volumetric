import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import Metric as MetricModel


class Metric(SQLAlchemyObjectType):
    class Meta:
        model = MetricModel
        interfaces = (relay.Node, )


class Query(graphene.ObjectType):
    hello = graphene.String()

    def resolve_hello(self, info):
        return 'Hello world!'

    all_metrics = SQLAlchemyConnectionField(Metric)


schema = graphene.Schema(query=Query)
