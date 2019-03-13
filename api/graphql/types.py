import graphene

from models.volumetrics import PhaseEnumGraphene
from utils.calculations import calculate, get_pvalue_func, get_mean, METRICS


class Metrics(graphene.Interface):
    bulk = graphene.Float()
    net = graphene.Float()
    porv = graphene.Float()
    hcpv = graphene.Float()
    stoiip = graphene.Float()
    giip = graphene.Float()
    associatedgas = graphene.Float()
    associatedliquid = graphene.Float()
    recoverable = graphene.Float()


class MetricsType(graphene.ObjectType):
    class Meta:
        interfaces = (Metrics, )


class Task(graphene.ObjectType):
    id = graphene.String()
    user = graphene.String()
    case_name = graphene.String()
    queued_at = graphene.DateTime()
    complete = graphene.Boolean()
    failed = graphene.Boolean()
    message = graphene.String()


class VolumetricType(graphene.ObjectType):
    class Meta:
        interfaces = (Metrics, )

    id = graphene.Int()
    realization = graphene.Int()
    phase = PhaseEnumGraphene

    def resolve_realization(self, info):
        return self.realization.realization


class VolumetricsType(graphene.ObjectType):
    case_id = graphene.Field(graphene.Int, description='A single case')
    zone_names = graphene.List(graphene.String, description='A list of zones for this case')
    region_names = graphene.List(graphene.String, description='A list of regions for this case')
    facies_names = graphene.List(graphene.String, description='A list of facies for this case')
    volumetrics = graphene.List(
        VolumetricType, description='A list of all the realizations of every location in the case')
    summed_volumetrics = graphene.List(
        VolumetricType, description='A list of volumetrics, grouped and summed by realization')
    percentiles = graphene.Field(
        MetricsType,
        percentile=graphene.Int(),
        description='The given percentile, calculated on the "summed_volumetrics list"')
    means = graphene.Field(MetricsType, description='The calculated mean on the "summed_volumetrics" list')

    def resolve_percentiles(self, info, percentile):
        volumetrics = self.summed_volumetrics
        return MetricsType(
            **
            {metric_name: calculate(volumetrics, metric_name, get_pvalue_func(percentile))
             for metric_name in METRICS})

    def resolve_means(self, info):
        volumetrics = self.summed_volumetrics
        return MetricsType(**{metric_name: calculate(volumetrics, metric_name, get_mean) for metric_name in METRICS})


class LocationType(graphene.ObjectType):
    id = graphene.Int()
    region_name = graphene.String()
    zone_name = graphene.String()
    facies_name = graphene.String()
    volumetrics = graphene.List(VolumetricType)
