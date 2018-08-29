import graphene

from models.location import Location as LocationModel
from utils.calculations import calculate, get_sum_means, get_pvalue_func
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


class CalcOnVolumetricsType(graphene.ObjectType):
    model_id = graphene.Int()
    zone_names = graphene.List(graphene.String)
    faultblock_names = graphene.List(graphene.String)
    facies_names = graphene.List(graphene.String)
    volumetrics = graphene.List(VolumetricType)
    percentiles = graphene.Field(PValuesType, percentile=graphene.Int())
    means = graphene.Field(MeanType)

    def resolve_percentiles(self, info, percentile):
        volumetrics = self.volumetrics
        return PValuesType(**{
            metric_name: calculate(volumetrics, metric_name, get_pvalue_func(percentile))
            for metric_name in metric_list
        })

    def resolve_means(self, info):
        volumetrics = self.volumetrics
        unique_locations = set([volumetric.location_id for volumetric in volumetrics])
        location_dict = dict.fromkeys(unique_locations)

        for location in unique_locations:
            location_dict[location] = \
                [volumetric for volumetric in volumetrics if volumetric.location_id == location]

        total_mean = get_sum_means(location_dict)
        return MeanType(**total_mean)


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
