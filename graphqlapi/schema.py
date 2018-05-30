import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import Model as ModelModel, Faultblock as FaultblockModel, Zone as ZoneModel, Field as FieldModel, Location as LocationModel, Volumetrics as VolumetricsModel


class Field(SQLAlchemyObjectType):
    class Meta:
        model = FieldModel
        interfaces = (relay.Node, )


class Faultblock(SQLAlchemyObjectType):
    class Meta:
        model = FaultblockModel
        interfaces = (relay.Node, )


class Zone(SQLAlchemyObjectType):
    class Meta:
        model = ZoneModel
        interfaces = (relay.Node, )


class Location(SQLAlchemyObjectType):
    class Meta:
        model = LocationModel
        interfaces = (relay.Node, )


class Model(SQLAlchemyObjectType):
    class Meta:
        model = ModelModel
        interfaces = (relay.Node, )


class Volumetrics(SQLAlchemyObjectType):
    class Meta:
        model = VolumetricsModel
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

    models = ModelConnectionField(Model, name=graphene.String(), user=graphene.String())
    fields = ModelConnectionField(Field, name=graphene.String())
    location = ModelConnectionField(
        Location, facies=graphene.String(), faultblock_id=graphene.Int(), zone_id=graphene.Int())
    #all_fields = ModelConnectionField(Field)
    #all_faultblocks = ModelConnectionField(Faultblock)
    #all_zones = ModelConnectionField(Zone)
    #all_locations = ModelConnectionField(Location)
    all_models = Model(Model)
    volumetrics = ModelConnectionField(Volumetrics, name=graphene.String())


schema = graphene.Schema(query=Query)
