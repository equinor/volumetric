from datetime import datetime

from utils.db import get_or_create
from utils.file import read_file
from utils.timer import timeit
from models import Model, Location, Volumetrics, db, Field


def _should_ignore(line_dict):
    is_facies_totals = line_dict['facies'] == 'Totals' if 'facies' in line_dict else False
    is_grv_zero = float(line_dict['grv']) == 0.0 if 'grv' in line_dict else False
    return line_dict['zone'] == 'Totals' or line_dict['faultblock'] == 'Totals' or is_facies_totals or is_grv_zero


def _add_faultblocks_or_zones_or_facies(data_dicts, model, database_model, column_name):
    added = {}
    for data_dict in data_dicts:
        name = data_dict[column_name]
        if name not in added:
            added[name] = database_model(name=name, model=model)
    return added


def _get_location_info(data_dict, model_id):
    faultblock = data_dict.get('faultblock', None)
    zone = data_dict.get('zone', None)
    facie = data_dict.get('facies', None)
    return f'{zone}{faultblock}{facie}{model_id}', facie, faultblock, zone


def _add_locations(data_dicts, model):
    added = {}
    for data_dict in data_dicts:
        location_key, facie, faultblock, zone = _get_location_info(data_dict, model_id=model.id)
        if location_key not in added:
            added[location_key] = Location(facies_name=facie, zone_name=zone, faultblock_name=faultblock, model=model)
    return added


def _add_volumetrics(data_dicts, locations, model):
    with db.engine.begin() as connection:
        inserts = []
        for data_dict in data_dicts:
            location_key, facie, faultblock, zone = _get_location_info(data_dict, model_id=model.id)
            location = locations[location_key]

            inserts.append({
                'grv': data_dict.get('grv'),
                'nrv': data_dict.get('nrv'),
                'npv': data_dict.get('npv'),
                'hcpv': data_dict.get('hcpv'),
                'stoiip': data_dict.get('stoiip'),
                'realization': data_dict.get('realization'),
                'location_id': location.id,
            })
        ins = Volumetrics.__table__.insert()
        connection.execute(ins, inserts)


@timeit
def import_model(filename, field_name, model_name, **kwargs):
    """
    Import a file containing a single model
    :param model_name: optional model name, read from file if not provided
    :param filename: path to file
    :param field_name: the name of the field that the model is based on
    """
    lines_as_ordered_dicts = read_file(filename)

    with db.engine.begin() as connection:

        field, was_created = get_or_create(db.session, Field, name=field_name)
        db.session.add(field)

        data_dicts = [line_dict for line_dict in lines_as_ordered_dicts if not _should_ignore(line_dict)]

        model_name = data_dicts[0]['model'] if not model_name else model_name
        model = Model(name=model_name, field=field, **kwargs)
        db.session.flush()

        locations = _add_locations(data_dicts, model=model)

        db.session.commit()

        _add_volumetrics(data_dicts, locations=locations, model=model)

        db.session.commit()
