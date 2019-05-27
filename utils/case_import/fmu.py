from collections import namedtuple

from models import Case, db, Field, Realization
from models import Location as LocationModel
from models.volumetrics import Volumetrics, PhaseEnum
from utils.calculations import METRICS
from utils.db import get_or_create
from utils.file import read_file

Location = namedtuple('Location', 'region zone facies license')


def _get_location_tuple(line_dict):
    return Location(
        line_dict.get('region'),
        line_dict.get('zone'),
        line_dict.get('facies'),
        line_dict.get('license'),
    )


def _get_unique_locations(lines_as_ordered_dicts):
    return set([_get_location_tuple(line_dict) for line_dict in lines_as_ordered_dicts])


def _add_locations(lines_as_ordered_dicts, case):
    return {
        location: LocationModel(
            facies_name=location.facies,
            zone_name=location.zone,
            region_name=location.region,
            license=location.license,
            case=case,
        )
        for location in _get_unique_locations(lines_as_ordered_dicts)
    }


RealizationTuple = namedtuple('Realization', ['location_id', 'realization', 'iteration'])


def _get_realization_tuple(data_dict, locations):
    location_tuple = _get_location_tuple(data_dict)
    location_id = locations[location_tuple].id
    return RealizationTuple(
        location_id=location_id,
        realization=data_dict.get('real'),
        iteration=data_dict.get('iter'),
    )


def _get_unique_realizations(lines_as_ordered_dicts, locations):
    return set([_get_realization_tuple(line_dict, locations) for line_dict in lines_as_ordered_dicts])


def _add_realizations(lines_as_ordered_dicts, locations):
    return {
        realization: Realization(
            realization=realization.realization,
            iteration=realization.iteration,
            location_id=realization.location_id,
        )
        for realization in _get_unique_realizations(lines_as_ordered_dicts, locations)
    }


def _get_phase_enum(phase):
    if phase == 'oil':
        return PhaseEnum.OIL
    elif phase == 'gas':
        return PhaseEnum.GAS
    elif phase == 'total':
        return PhaseEnum.TOTAL
    else:
        raise RuntimeError('unsupported phase')


def _get_volumetrics_for_phase(line_dict, phase, realization):
    return {
        'realization_id': realization.id,
        'phase': _get_phase_enum(phase),
        'bulk': line_dict.get(f'bulk_{phase}'),
        'net': line_dict.get(f'net_{phase}'),
        'porv': line_dict.get(f'porv_{phase}'),
        'hcpv': line_dict.get(f'hcpv_{phase}'),
        'stoiip': line_dict.get(f'stoiip_{phase}'),
        'associatedgas': line_dict.get(f'associatedgas_{phase}'),
        'associatedliquid': line_dict.get(f'associatedliquid_{phase}'),
        'recoverable': line_dict.get(f'recoverable_{phase}'),
        'giip': line_dict.get(f'giip_{phase}'),
    }


def _add_volumetrics(lines_as_ordered_dicts, realizations, locations):
    inserts = []
    for line_dict in lines_as_ordered_dicts:
        realization = realizations.get(_get_realization_tuple(line_dict, locations))

        for phase in ['oil', 'gas', 'total']:
            volumetric = _get_volumetrics_for_phase(line_dict, phase, realization)
            bulk_metric = volumetric.get('bulk')
            if bulk_metric is not None and float(bulk_metric) != 0.0:
                inserts.append(volumetric)

    ins = Volumetrics.__table__.insert()
    db.session.execute(ins, inserts)


def _read_fmu_file(filename):
    lines_as_ordered_dicts = read_file(filename, delimiter=",")
    bulks = [f'bulk_{phase.value.lower()}' for phase in PhaseEnum]
    return [
        line for line in lines_as_ordered_dicts if any(
            line.get(bulk) is not None and float(line.get(bulk)) != 0.0 for bulk in bulks)
    ]


def _get_column(lines_as_ordered_dicts, metric=None):
    phases = [phase.value for phase in PhaseEnum]
    return [line.get(f'{metric}_{phase.lower()}') for line in lines_as_ordered_dicts for phase in phases]


def _get_metrics_with_data(lines_as_ordered_dicts):
    metrics_with_data = []
    for metric in METRICS:
        metric_values = _get_column(lines_as_ordered_dicts, metric)
        for value in metric_values:
            if value is not None:
                metrics_with_data.append(metric)
                break
    return metrics_with_data


def _get_phases_with_data(lines_as_ordered_dicts):
    phases = []
    for phase in PhaseEnum:
        phase_data = [
            line.get(f'{metric}_{phase.value.lower()}') for line in lines_as_ordered_dicts for metric in METRICS
        ]
        for phase_value in phase_data:
            if phase_value is not None:
                phases.append(phase)
                break
    return phases


def import_fmu_case(filename, field_name, case_name, **kwargs):
    lines_as_ordered_dicts = _read_fmu_file(filename)

    field, was_created = get_or_create(db.session, Field, name=field_name)
    db.session.add(field)

    case_name = case_name if case_name else lines_as_ordered_dicts[0]['case']
    metrics = _get_metrics_with_data(lines_as_ordered_dicts)
    phases = _get_phases_with_data(lines_as_ordered_dicts)
    case = Case(name=case_name, field=field, metrics=metrics, phases=phases, **kwargs)
    db.session.flush()

    locations = _add_locations(lines_as_ordered_dicts, case)
    db.session.flush()

    realizations = _add_realizations(lines_as_ordered_dicts, locations=locations)
    db.session.add_all(realizations.values())
    db.session.flush()

    _add_volumetrics(lines_as_ordered_dicts, realizations=realizations, locations=locations)


REQUIRED_HEADERS = ['region', 'zone']


def validate_fmu_case(filename):
    lines_as_ordered_dicts = _read_fmu_file(filename)

    if len(lines_as_ordered_dicts) == 0:
        return False, f'The file has no valid lines'

    line_dict = lines_as_ordered_dicts[0]
    has_required_headers = all(header in line_dict for header in REQUIRED_HEADERS)
    message = f'The imported file does not have the required columns {",".join(REQUIRED_HEADERS)}' if not has_required_headers else ''
    return has_required_headers, message
