import graphene
from graphql import GraphQLError
from utils.calculations import sum_volumetrics as calc_sum_volumetrics
from utils.ordering import ordered_model, OrderedList

from models import Volumetrics as VolumetricsModel, Field as FieldModel, Location as LocationModel, db, \
    Model as ModelModel
from .field import Field as FieldType, AddField
from .importMetrics import ImportModel
from .types import VolumetricsType, VolumetricType, ModelTypeEnum


def get_volumetrics(model_id, kwargs):
    filter_queries = [getattr(LocationModel, key[:-1]).in_(value) for key, value in kwargs.items()]
    location_query = db.session.query(LocationModel.id).filter(LocationModel.model_id == model_id)
    for filter_query in filter_queries:
        location_query = location_query.filter(filter_query)
    location_ids = location_query.all()
    if not location_ids:
        return []

    return VolumetricsModel.query.filter(VolumetricsModel.location_id.in_(
        [location.id for location in location_ids])).all()


def sum_volumetrics(volumetrics):
    summed_volumetrics = calc_sum_volumetrics(volumetrics)
    return [VolumetricType(**summed_volumetrics[volumetric_dict]) for volumetric_dict in summed_volumetrics]


class Query(graphene.ObjectType):
    @ordered_model
    def resolve_fields(self, info, **kwargs):
        user = info.context.user
        fields = FieldModel.query.filter_by(**kwargs).all()
        if user.isAdmin:
            return fields

        field_types = []
        for field in fields:
            field_type = FieldType()
            field_type.name = field.name
            field_type.models = [
                model for model in field.models if model.created_user == user.shortname or model.is_official
            ]
            if len(field_type.models) > 0:
                field_types.append(field_type)
        return field_types

    def resolve_volumetrics(self, info, model_id, **kwargs):
        user = info.context.user
        model = ModelModel.query.filter(ModelModel.id == model_id).first()

        if not (user.isAdmin or model.is_official or model.created_user == user.shortname):
            raise GraphQLError('Forbidden')

        filtered_kwargs = {k: v for k, v in kwargs.items() if None not in v}
        # Open for improvements
        if not filtered_kwargs and not model_id:
            raise GraphQLError('This query requires 1-4 filters.')

        volumetrics = get_volumetrics(model_id, filtered_kwargs)
        volumetrics = sorted(volumetrics, key=lambda volumetric: volumetric.realization)

        summed_volumetrics = sum_volumetrics(volumetrics)

        return VolumetricsType(
            model_id=model_id,
            zone_names=kwargs.get('zone_names'),
            faultblock_names=kwargs.get('faultblock_names'),
            facies_names=kwargs.get('facies_names'),
            volumetrics=volumetrics,
            summed_volumetrics=summed_volumetrics,
        )

    def resolve_model_types(self, info):
        return [ModelTypeEnum.FULL_FIELD, ModelTypeEnum.SEGMENT]

    fields = OrderedList(FieldType, name=graphene.String())

    model_types = graphene.List(ModelTypeEnum)

    volumetrics = graphene.Field(
        VolumetricsType,
        facies_names=graphene.List(graphene.String),
        faultblock_names=graphene.List(graphene.String),
        zone_names=graphene.List(graphene.String),
        model_id=graphene.Int())


class Mutations(graphene.ObjectType):
    add_field = AddField.Field()
    import_model = ImportModel.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
