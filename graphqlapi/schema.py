import graphene
from models import Model as ModelModel, Faultblock as FaultblockModel, \
    Volumetrics as VolumetricsModel, Location as LocationModel, Field as FieldModel
from graphqlapi.types import ModelType, VolumetricType, FaultblockType, LocationType, FieldType, ZoneType


def get_query_results(db_model, **kwargs):
    query = db_model.query
    kwargs = {key: value for key, value in kwargs.items() if value is not None}
    return query.filter_by(**kwargs).all()


class Query(graphene.ObjectType):
    model = graphene.List(ModelType, name=graphene.String(), user=graphene.String(), faultblock=graphene.String())
    location = graphene.List(
        LocationType, id=graphene.ID(), faultblock_id=graphene.ID(), zone_id=graphene.ID(), facies=graphene.String())
    faultblock = graphene.List(FaultblockType, name=graphene.String(), id=graphene.Int(), model_id=graphene.Int())
    field = graphene.List(FieldType, name=graphene.String())
    volumetric = graphene.List(VolumetricType, id=graphene.Int(), location_id=graphene.Int())
    zone = graphene.List(ZoneType, id=graphene.ID(), name=graphene.String(), model_id=graphene.ID())

    def resolve_faultblock(self, info, name=None, id=None, model_id=None):
        return get_query_results(FaultblockModel, name=name, id=id, model_id=model_id)

    def resolve_volumetric(self, info, id=None, location_id=None):
        return get_query_results(VolumetricsModel, id=id, location_id=location_id)

    def resolve_location(self, info, id=None, faultblock_id=None, zone_id=None, facies=None):
        return get_query_results(LocationModel, id=id, faultblock_id=faultblock_id, zone_id=zone_id, facies=facies)

    def resolve_model(self, info, name=None, user=None, faultblock_name=None):
        return get_query_results(ModelModel, name=name, user=user, faultblock_name=faultblock_name)

    def resolve_field(self, info, name=None):
        return get_query_results(FieldModel, name=name)

    def resolve_model(self, info, name=None, user=None, faultblocks=None, zones=None):
        return get_query_results(ModelModel, name=name, user=user, faultblocks=faultblocks, zones=zones)


schema = graphene.Schema(query=Query)
