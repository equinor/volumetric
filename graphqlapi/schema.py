from models import Model as ModelModel, Volumetrics as VolumetricsModel, Location as LocationModel, Field as FieldModel, \
    db
from graphqlapi.types import *
from graphql import GraphQLError


def get_volumetrics(model_name, kwargs):
    filter_queries = [getattr(LocationModel, key).in_(value) for key, value in kwargs.items()]
    location_query = db.session.query(LocationModel.id).filter(LocationModel.model_name == model_name)
    for filter_query in filter_queries:
        location_query = location_query.filter(filter_query)
    location_ids = location_query.all()

    return VolumetricsModel.query.filter(VolumetricsModel.location_id.in_(location_ids)).all()


class Query(graphene.ObjectType):
    def resolve_models(self, info, **kwargs):
        return ModelModel.query.filter_by(**kwargs).all()

    def resolve_model(self, info, model_name):

        def get_distinct_location_keys(model_name, entitie):
            return LocationModel.query.filter_by(model_name=model_name).with_entities(entitie).distinct()

        facies = [fa.facies_name for fa in get_distinct_location_keys(model_name,
                                                                      LocationModel.facies_name)]
        zones = [fa[0] for fa in get_distinct_location_keys(model_name, LocationModel.zone_name)]

        faultblocks = [fa[0] for fa in get_distinct_location_keys(model_name,
                                                                  LocationModel.faultblock_name)]

        return ModelType(
            name=model_name,
            facies=facies,
            faultblocks=faultblocks,
            zones=zones
        )

    def resolve_locations(self, info, **kwargs):
        return LocationModel.query.filter_by(**kwargs).all()

    def resolve_field(self, info, **kwargs):
        return FieldModel.query.filter_by(**kwargs).all()

    def resolve_volumetric(self, info, model_name, **kwargs):
        filtered_kwargs = {k: v for k, v in kwargs.items() if None not in v}

        # Open for improvements
        if not filtered_kwargs and not model_name:
            raise GraphQLError('This query requires 1-4 filters.')

        return get_volumetrics(model_name, filtered_kwargs)

    def resolve_calc_on_volumetrics(self, info, model_name, **kwargs):
        filtered_kwargs = {k: v for k, v in kwargs.items() if None not in v}

        # Open for improvements
        if not filtered_kwargs and not model_name:
            raise GraphQLError('This query requires 1-4 filters.')

        volumetrics = get_volumetrics(model_name, filtered_kwargs)

        return CalcOnVolumetricsType(
            zone_name=kwargs.get('zone_name'),
            faultblock_name=kwargs.get('faultblock_name'),
            facies_name=kwargs.get('facies_name'),
            volumetrics=volumetrics,
        )

    models = graphene.List(
        ModelsType,
        name=graphene.String(),
        user=graphene.String(),
        faultblocks=graphene.String(),
        field_name=graphene.String())

    model = graphene.Field(
        ModelType,
        model_name=graphene.String())

    locations = graphene.List(
        LocationType,
        faultblock_name=graphene.String(),
        zone_name=graphene.String(),
        facies_name=graphene.List(graphene.String))

    field = graphene.List(FieldType, name=graphene.String())

    volumetric = graphene.List(
        VolumetricType,
        facies_name=graphene.List(graphene.String),
        faultblock_name=graphene.List(graphene.String),
        zone_name=graphene.List(graphene.String),
        model_name=graphene.String())

    calc_on_volumetrics = graphene.Field(
        CalcOnVolumetricsType,
        facies_name=graphene.List(graphene.String),
        faultblock_name=graphene.List(graphene.String),
        zone_name=graphene.List(graphene.String),
        model_name=graphene.String())


schema = graphene.Schema(query=Query)
