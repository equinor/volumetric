import graphene

from models.case import CaseTypeEnum
from models import (Location as LocationModel, PhaseEnum, Volumetrics as VolumetricsModel, Realization as
                    RealizationModel, db)
from models.volumetrics import PhaseEnumGraphene
from utils.calculations import calculate, get_pvalue_func, get_mean, METRICS
from utils.ordering import OrderedList, ordered_strings


def case_type_description(value):
    if value == CaseTypeEnum.SEGMENT:
        return 'Case describing a segmented part of the field'
    elif value == CaseTypeEnum.FULL_FIELD:
        return 'Case describing the full field'


CaseTypeGrapheneEnum = graphene.Enum.from_enum(CaseTypeEnum, description=lambda value: case_type_description(value))


class Metrics(graphene.ObjectType):
    bulk = graphene.Float()
    net = graphene.Float()
    porv = graphene.Float()
    hcpv = graphene.Float()
    stoiip = graphene.Float()
    giip = graphene.Float()
    associatedgas = graphene.Float()
    associatedliquid = graphene.Float()
    recoverable = graphene.Float()


class TaskType(graphene.ObjectType):
    id = graphene.String()
    user = graphene.String()
    case_name = graphene.String()
    queued_at = graphene.DateTime()
    complete = graphene.Boolean()
    failed = graphene.Boolean()
    message = graphene.String()


class VolumetricType(Metrics):
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
        Metrics,
        percentile=graphene.Int(),
        description='The given percentile, calculated on the "summed_volumetrics list"')
    means = graphene.Field(Metrics, description='The calculated mean on the "summed_volumetrics" list')

    def resolve_percentiles(self, info, percentile):
        volumetrics = self.summed_volumetrics
        return Metrics(
            **
            {metric_name: calculate(volumetrics, metric_name, get_pvalue_func(percentile))
             for metric_name in METRICS})

    def resolve_means(self, info):
        volumetrics = self.summed_volumetrics
        return Metrics(**{metric_name: calculate(volumetrics, metric_name, get_mean) for metric_name in METRICS})


class LocationType(graphene.ObjectType):
    id = graphene.Int()
    region_name = graphene.String()
    zone_name = graphene.String()
    facies_name = graphene.String()
    volumetrics = graphene.List(VolumetricType)


def get_distinct_location_keys(case_id, entity):
    return LocationModel.query.filter_by(case_id=case_id).with_entities(entity).distinct()


class CaseType(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    case_version = graphene.String()
    case_type = CaseTypeGrapheneEnum()
    description = graphene.String()
    is_official = graphene.Boolean()
    is_currently_official = graphene.Boolean()
    official_from_date = graphene.DateTime()
    official_to_date = graphene.DateTime()
    created_user = graphene.String()
    created_date = graphene.DateTime()
    field_name = graphene.String()
    regions = OrderedList(graphene.String)
    zones = OrderedList(graphene.String)
    facies = OrderedList(graphene.String)
    phases = OrderedList(PhaseEnumGraphene)

    @ordered_strings
    def resolve_regions(self, info):
        return [region.region_name for region in get_distinct_location_keys(self.id, LocationModel.region_name)]

    @ordered_strings
    def resolve_zones(self, info):
        return [zone.zone_name for zone in get_distinct_location_keys(self.id, LocationModel.zone_name)]

    @ordered_strings
    def resolve_facies(self, info):
        return [facies.facies_name for facies in get_distinct_location_keys(self.id, LocationModel.facies_name)]

    def resolve_phases(self, info):
        phases = [
            phase.phase
            for phase in db.session.query(VolumetricsModel.phase).join(RealizationModel).join(LocationModel).filter_by(
                case_id=self.id).distinct()
        ]

        return [phase for phase in PhaseEnum if phase in phases]  # Keep order from enum
