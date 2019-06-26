import graphene
from graphql import GraphQLError

from models import Case as CaseModel
from models.volumetrics import PhaseEnumGraphene
from services.database_service import DatabaseService
from utils.authentication import is_reader
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


class VolumetricType(graphene.ObjectType):
    class Meta:
        interfaces = (Metrics, )

    id = graphene.Int()
    realization = graphene.Int()
    phase = PhaseEnumGraphene


class VolumetricsType(graphene.ObjectType):
    case_id = graphene.Field(graphene.Int, description='A single case')
    zone_names = graphene.List(graphene.String, description='A list of zones for this case')
    region_names = graphene.List(graphene.String, description='A list of regions for this case')
    facies_names = graphene.List(graphene.String, description='A list of facies for this case')
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


def resolve_volumetrics(self, info, case_ids, phase, **kwargs):
    user = info.context.user
    volumetrics = []
    for case_id in case_ids:
        case = CaseModel.query.filter(CaseModel.id == case_id).first()

        # Deny if user dont have access to field
        if not is_reader(user, case.field.name):
            raise GraphQLError('You are not authorized to view this case.')

        # Return only personal or official data if user is not administrator
        if not user.isAdmin and not (case.is_shared or case.created_user == user.shortname):
            raise GraphQLError('You are not authorized to view this case.')

        filtered_kwargs = {key: value for key, value in kwargs.items() if None not in value}

        summed_volumetrics = DatabaseService.get_summed_volumetrics(case_id, filtered_kwargs, phase)
        summed_volumetrics = sorted(summed_volumetrics, key=lambda volumetric: volumetric.realization)

        volumetrics.append(
            VolumetricsType(
                case_id=case_id,
                zone_names=kwargs.get('zone_names'),
                region_names=kwargs.get('region_names'),
                facies_names=kwargs.get('facies_names'),
                summed_volumetrics=summed_volumetrics,
            ))
    return volumetrics
