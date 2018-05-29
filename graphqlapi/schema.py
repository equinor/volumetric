import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import Model as ModelModel, Faultblock as FaultblockModel, Zone as ZoneModel


class Faultblock(SQLAlchemyObjectType):
    class Meta:
        model = FaultblockModel
        interfaces = (relay.Node, )


class Zone(SQLAlchemyObjectType):
    class Meta:
        model = ZoneModel
        interfaces = (relay.Node, )


class Model(SQLAlchemyObjectType):
    class Meta:
        model = ModelModel
        interfaces = (relay.Node, )


class ModelConnectionField(SQLAlchemyConnectionField):
    RELAY_ARGS = ['first', 'last', 'before', 'after']

    @classmethod
    def get_query(cls, model, info, **args):
        query = super(ModelConnectionField, cls).get_query(model, info, **args)
        for field, value in args.items():
            if field not in cls.RELAY_ARGS:
                query = query.filter(getattr(model, field) == value)
        return query


class Query(graphene.ObjectType):

    all_metrics = ModelConnectionField(Model, name=graphene.String())


schema = graphene.Schema(query=Query)
