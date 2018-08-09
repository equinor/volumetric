import graphene
from utils.calculations import get_mean, get_pvalue_func


class VolumetricType(graphene.ObjectType):
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


def calculate(volumetrics, metric_name, calculation_function):
    dataset = []
    for volumetric in volumetrics:
        metric = getattr(volumetric, metric_name)
        if metric is None:
            return None
        dataset.append(float(metric))

    return calculation_function(dataset)


class CalcOnVolumetricsType(graphene.ObjectType):
    zone_name = graphene.String()
    faultblock_name = graphene.String()
    facies_name = graphene.String()
    volumetrics = graphene.List(VolumetricType)
    percentiles = graphene.Field(PValuesType, percentile=graphene.Int())
    means = graphene.Field(MeanType)

    def resolve_percentiles(self, info, percentile):
        volumetrics = self.volumetrics
        return PValuesType(
            **{metric_name: calculate(volumetrics, metric_name, get_pvalue_func(percentile))
               for metric_name in ['stoiip', 'grv', 'nrv', 'npv', 'hcpv']}
        )

    def resolve_means(self, info):
        volumetrics = self.volumetrics
        return MeanType(
            **{metric_name: calculate(volumetrics, metric_name, get_mean)
               for metric_name in ['stoiip', 'grv', 'nrv', 'npv', 'hcpv']}
        )


class LocationType(graphene.ObjectType):
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


class ModelsType(graphene.ObjectType):
    name = graphene.String()
    user = graphene.String()
    field_name = graphene.String()
    faultblocks = graphene.List(FaultblockType)
    zones = graphene.List(ZoneType)
    facies = graphene.List(FaciesType)


class ModelType(graphene.ObjectType):
    name = graphene.String()
    faultblocks = graphene.List(graphene.String)
    zones = graphene.List(graphene.String)
    facies = graphene.List(graphene.String)


class FieldType(graphene.ObjectType):
    name = graphene.String()
    models = graphene.List(ModelType)
