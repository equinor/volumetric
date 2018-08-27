import graphene
from graphql import GraphQLError
from utils.ordering import ordered_model

from models import Volumetrics as VolumetricsModel, Field as FieldModel, Location as LocationModel, db
from utils.ordering import OrderedList
from .field import Field as FieldType, AddField
from .importMetrics import ImportModel
from .types import CalcOnVolumetricsType


def get_volumetrics(model_name, kwargs):
    filter_queries = [getattr(LocationModel, key[:-1]).in_(value) for key, value in kwargs.items()]
    location_query = db.session.query(LocationModel.id).filter(LocationModel.model_name == model_name)
    for filter_query in filter_queries:
        location_query = location_query.filter(filter_query)
    location_ids = location_query.all()
    if not location_ids:
        return []

    return VolumetricsModel.query.filter(VolumetricsModel.location_id.in_(
        [location.id for location in location_ids])).all()


class Query(graphene.ObjectType):
    @ordered_model
    def resolve_fields(self, info, **kwargs):
        return FieldModel.query.filter_by(**kwargs).all()

    def resolve_calc_on_volumetrics(self, info, model_name, **kwargs):
        filtered_kwargs = {k: v for k, v in kwargs.items() if None not in v}
        # Open for improvements
        if not filtered_kwargs and not model_name:
            raise GraphQLError('This query requires 1-4 filters.')

        volumetrics = get_volumetrics(model_name, filtered_kwargs)

        return CalcOnVolumetricsType(
            zone_names=kwargs.get('zone_names'),
            faultblock_names=kwargs.get('faultblock_names'),
            facies_names=kwargs.get('facies_names'),
            volumetrics=volumetrics,
        )

    fields = OrderedList(FieldType, name=graphene.String())

    calc_on_volumetrics = graphene.Field(
        CalcOnVolumetricsType,
        facies_names=graphene.List(graphene.String),
        faultblock_names=graphene.List(graphene.String),
        zone_names=graphene.List(graphene.String),
        model_name=graphene.String())


class Mutations(graphene.ObjectType):
    add_field = AddField.Field()
    import_model = ImportModel.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
