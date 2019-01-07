from collections import namedtuple

from models import Location, Field, db, Case, Realization
from models.volumetrics import PhaseEnum, Volumetrics
from utils.db import get_or_create
from utils.file import read_file


def _should_ignore(line_dict):
    is_facies_totals = line_dict['facies'] == 'Totals' if 'facies' in line_dict else False
    is_grv_zero = float(line_dict['grv']) == 0.0 if 'grv' in line_dict else False
    return line_dict['zone'] == 'Totals' or line_dict['faultblock'] == 'Totals' or is_facies_totals or is_grv_zero


def _add_regions_or_zones_or_facies(data_dicts, model, database_model, column_name):
    added = {}
    for data_dict in data_dicts:
        name = data_dict[column_name]
        if name not in added:
            added[name] = database_model(name=name, model=model)
    return added


LocationTuple = namedtuple('Location', ['region', 'zone', 'facies', 'case_id'])


def _get_location_info(data_dict, case_id):
    return LocationTuple(
        region=data_dict.get('faultblock', None),
        zone=data_dict.get('zone', None),
        facies=data_dict.get('facies', None),
        case_id=case_id)


def _add_locations(data_dicts, case):
    added = {}
    for data_dict in data_dicts:
        location_key = _get_location_info(data_dict, case_id=case.id)
        if location_key not in added:
            added[location_key] = Location(
                facies_name=location_key.facies,
                zone_name=location_key.zone,
                region_name=location_key.region,
                license='Custom license',
                case=case)
    return added


RealizationTuple = namedtuple('Realization', ['location_id', 'realization', 'iteration'])


def _get_realization_key(data_dict, locations, case):
    location_key = _get_location_info(data_dict, case_id=case.id)
    location_id = locations[location_key].id
    return RealizationTuple(
        location_id=location_id,
        realization=data_dict.get('realization'),
        iteration=data_dict.get('iteration', 1),
    )


def _add_realizations(data_dicts, locations, case):
    added = {}
    for data_dict in data_dicts:
        realization_key = _get_realization_key(data_dict, locations=locations, case=case)
        if realization_key not in added:
            added[realization_key] = Realization(
                realization=realization_key.realization,
                iteration=realization_key.iteration,
                location_id=realization_key.location_id,
            )
    return added


def _add_volumetrics(data_dicts, realizations, locations, case):
    inserts = []
    for data_dict in data_dicts:
        realization_key = _get_realization_key(data_dict, locations, case)
        realization = realizations[realization_key]

        inserts.append({
            'bulk': data_dict.get('grv'),
            'net': data_dict.get('nrv'),
            'porv': data_dict.get('npv'),
            'hcpv': data_dict.get('hcpv'),
            'stoiip': data_dict.get('stoiip'),
            'phase': PhaseEnum.GAS,
            'realization_id': realization.id,
        })
    ins = Volumetrics.__table__.insert()
    db.session.execute(ins, inserts)


def import_custom_case(filename, field_name, case_name, **kwargs):
    lines_as_ordered_dicts = read_file(filename)

    field, was_created = get_or_create(db.session, Field, name=field_name)
    db.session.add(field)

    data_dicts = [line_dict for line_dict in lines_as_ordered_dicts if not _should_ignore(line_dict)]

    case_name = case_name if case_name else lines_as_ordered_dicts[0]['model']
    case = Case(name=case_name, field=field, **kwargs)
    db.session.flush()

    locations = _add_locations(data_dicts, case=case)
    db.session.flush()

    realizations = _add_realizations(data_dicts, locations=locations, case=case)
    db.session.add_all(realizations.values())
    db.session.flush()

    _add_volumetrics(data_dicts, realizations=realizations, locations=locations, case=case)
    db.session.commit()
