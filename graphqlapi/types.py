import graphene
from utils.calculations import calculate, get_mean, get_pvalue_func, get_sum_means
from models.location import Location as LocationModel
from utils.calculations import get_mean, get_pvalue_func
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
    model_name = graphene.Field(graphene.String)
    zone_names = graphene.List(graphene.String)
    faultblock_names = graphene.List(graphene.String)
    facies_names = graphene.List(graphene.String)
    volumetrics = graphene.List(VolumetricType)
    percentiles = graphene.Field(PValuesType, percentile=graphene.Int())
    means = graphene.Field(MeanType)

    def resolve_percentiles(self, info, percentile):
        volumetrics = self.volumetrics
        return PValuesType(
            **{
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
        return MeanType(
            **total_mean
        )


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


def get_distinct_location_keys(model_name, entity):
    return LocationModel.query.filter_by(model_name=model_name).with_entities(entity).distinct()


class ModelType(graphene.ObjectType):
    name = graphene.String()
    user = graphene.String()
    field_name = graphene.String()
    faultblocks = OrderedList(graphene.String)
    zones = OrderedList(graphene.String)
    facies = OrderedList(graphene.String)

    @ordered_strings
    def resolve_faultblocks(self, info):
        faultblocks = [
            faultblock.faultblock_name
            for faultblock in get_distinct_location_keys(self.name, LocationModel.faultblock_name)
        ]
        return faultblocks

    @ordered_strings
    def resolve_zones(self, info):
        return [zone.zone_name for zone in get_distinct_location_keys(self.name, LocationModel.zone_name)]

    @ordered_strings
    def resolve_facies(self, info):
        return [facies.facies_name for facies in get_distinct_location_keys(self.name, LocationModel.facies_name)]
