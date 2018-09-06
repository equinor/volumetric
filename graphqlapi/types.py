import graphene
from models.location import Location as LocationModel
from utils.calculations import calculate, get_pvalue_func, get_mean
from utils.ordering import OrderedList, ordered_strings

metric_list = ['stoiip', 'grv', 'nrv', 'npv', 'hcpv']


class VolumetricType(graphene.ObjectType):
    id = graphene.Int()
    realization = graphene.Int()
    grv = graphene.Float()
    nrv = graphene.Float()
    npv = graphene.Float()
    hcpv = graphene.Float()
    stoiip = graphene.Float()


class MeanType(graphene.ObjectType):
    stoiip = graphene.Float()
    grv = graphene.Float()
    nrv = graphene.Float()
    npv = graphene.Float()
    hcpv = graphene.Float()


class PValuesType(graphene.ObjectType):
    stoiip = graphene.Float()
    grv = graphene.Float()
    nrv = graphene.Float()
    npv = graphene.Float()
    hcpv = graphene.Float()


class VolumetricsType(graphene.ObjectType):
    model_id = graphene.Field(graphene.Int, description='A single model')
    zone_names = graphene.List(graphene.String, description='A list of zones within the model')
    faultblock_names = graphene.List(graphene.String, description='A list of faultblocks within the model')
    facies_names = graphene.List(graphene.String, description='A list of facies within the model')
    volumetrics = graphene.List(VolumetricType,
                                description='A list of all the realizations of every location in the model')
    summed_volumetrics = graphene.List(VolumetricType,
                                       description='A list of volumetrics, grouped and summed by realization')
    percentiles = graphene.Field(PValuesType, percentile=graphene.Int(),
                                 description='The given percentile, calculated on the "summed_volumetrics list"')
    means = graphene.Field(MeanType, description='The calculated mean on the "summed_volumetrics" list')

    def resolve_percentiles(self, info, percentile):
        volumetrics = self.summed_volumetrics
        return PValuesType(
            **{
                metric_name: calculate(volumetrics, metric_name, get_pvalue_func(percentile))
                for metric_name in metric_list
            }
        )

    def resolve_means(self, info):
        volumetrics = self.summed_volumetrics
        return MeanType(
            **{
                metric_name: calculate(volumetrics, metric_name, get_mean)
                for metric_name in metric_list
            })


class LocationType(graphene.ObjectType):
    id = graphene.Int()
    faultblock_name = graphene.String()
    zone_name = graphene.String()
    facies_name = graphene.String()
    volumetrics = graphene.List(VolumetricType)


class FaultblockType(graphene.ObjectType):
    model_name = graphene.String()
    name = graphene.String()
    locations = graphene.List(LocationType)


class ZoneType(graphene.ObjectType):
    name = graphene.String()
    model_name = graphene.String()
    locations = graphene.List(LocationType)


class FaciesType(graphene.ObjectType):
    name = graphene.String()
    model_name = graphene.String()
    locations = graphene.List(LocationType)


def get_distinct_location_keys(model_id, entity):
    return LocationModel.query.filter_by(model_id=model_id).with_entities(entity).distinct()


class ModelTypeEnum(graphene.Enum):
    SEGMENT = 1
    FULL_FIELD = 2

    @property
    def description(self):
        if self == ModelTypeEnum.SEGMENT:
            return 'Model describing a segmented part of the field'
        elif self == ModelTypeEnum.FULL_FIELD:
            return 'Model describing the full field'


class ModelType(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    model_version = graphene.String()
    model_type = ModelTypeEnum()
    description = graphene.String()
    is_official = graphene.Boolean()
    is_currently_official = graphene.Boolean()
    official_from_date = graphene.DateTime()
    official_to_date = graphene.DateTime()
    created_user = graphene.String()
    created_date = graphene.DateTime()
    field_name = graphene.String()
    faultblocks = OrderedList(graphene.String)
    zones = OrderedList(graphene.String)
    facies = OrderedList(graphene.String)

    @ordered_strings
    def resolve_faultblocks(self, info):
        faultblocks = [
            faultblock.faultblock_name
            for faultblock in get_distinct_location_keys(self.id, LocationModel.faultblock_name)
        ]
        return faultblocks

    @ordered_strings
    def resolve_zones(self, info):
        return [zone.zone_name for zone in get_distinct_location_keys(self.id, LocationModel.zone_name)]

    @ordered_strings
    def resolve_facies(self, info):
        return [facies.facies_name for facies in get_distinct_location_keys(self.id, LocationModel.facies_name)]
