import graphene
from graphql import GraphQLError

from models import Volumetrics as VolumetricsModel, Field as FieldModel, Location as LocationModel, db
from .field import Field as FieldType, AddField
from .importMetrics import ImportModel
from .types import CalcOnVolumetricsType


def get_volumetrics(model_name, kwargs):
    filter_queries = [getattr(LocationModel, key).in_(value) for key, value in kwargs.items()]
    location_query = db.session.query(LocationModel.id).filter(LocationModel.model_name == model_name)
    for filter_query in filter_queries:
        location_query = location_query.filter(filter_query)
    location_ids = location_query.all()
    if not location_ids:
        return []

    return VolumetricsModel.query.filter(VolumetricsModel.location_id.in_(location_ids)).all()


class Query(graphene.ObjectType):
    def resolve_fields(self, info, **kwargs):
        return FieldModel.query.filter_by(**kwargs).all()

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

    fields = graphene.List(FieldType, name=graphene.String())

    calc_on_volumetrics = graphene.Field(
        CalcOnVolumetricsType,
        facies_name=graphene.List(graphene.String),
        faultblock_name=graphene.List(graphene.String),
        zone_name=graphene.List(graphene.String),
        model_name=graphene.String())


class Mutations(graphene.ObjectType):
    add_field = AddField.Field()
    import_model = ImportModel.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
