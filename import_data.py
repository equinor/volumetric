from utils.db import get_or_create
from utils.file import read_file
from utils.timer import timeit
from models import Model, Faultblock, Zone, Location, Volumetrics, db, Field


def _should_ignore(line_dict):
    return line_dict['Zone'] == 'Totals' or line_dict['Faultblock'] == 'Totals'


def _add_faultblocks_or_zones(data_dicts, model, database_model, column_name):
    added = {}
    for data_dict in data_dicts:
        name = data_dict[column_name]
        if name not in added:
            added[name] = database_model(name=name, model=model)
    return added


def _get_location_info(data_dict, faultblocks, zones):
    facies = data_dict['Facies'] if 'Facies' in data_dict else None
    faultblock = faultblocks[data_dict['Faultblock']]
    zone = zones[data_dict['Zone']]
    return f'{zone.name}{faultblock.name}{facies}', facies, faultblock, zone


def _add_locations(data_dicts, faultblocks, zones):
    added = {}
    for data_dict in data_dicts:
        location_key, facies, faultblock, zone = _get_location_info(data_dict, faultblocks=faultblocks, zones=zones)
        if location_key not in added:
            added[location_key] = Location(facies=facies, zone=zone, faultblock=faultblock)
    return added


def _add_volumetrics(data_dicts, faultblocks, zones, locations):
    for data_dict in data_dicts:
        location_key, facies, faultblock, zone = _get_location_info(data_dict, faultblocks=faultblocks, zones=zones)
        location = locations[location_key]
        location.volumetrics.append(
            Volumetrics(
                grv=data_dict['GRV'],
                nrv=data_dict['NRV'],
                npv=data_dict['NPV'],
                hcpv=data_dict['HCPV'],
                stoiip=data_dict['STOIIP'],
                realization=data_dict['Realization'] if 'Realization' in data_dict else None))


@timeit
def import_model(filename, user='test', field_name='Tordis'):
    """
    Import a file containing a single model
    :param filename: path to file
    :param user: the name of the user that is importing the file
    :param field_name: the name of the field that the model is based on
    """
    lines_as_ordered_dicts = read_file(filename)

    field, was_created = get_or_create(db.session, Field, name=field_name)

    data_dicts = [line_dict for line_dict in lines_as_ordered_dicts if not _should_ignore(line_dict)]

    model_name = data_dicts[0]['Model']
    model = Model(name=model_name, user=user, field=field)

    faultblocks = _add_faultblocks_or_zones(data_dicts, model, database_model=Faultblock, column_name='Faultblock')

    zones = _add_faultblocks_or_zones(data_dicts, model, database_model=Zone, column_name='Zone')

    locations = _add_locations(data_dicts, faultblocks=faultblocks, zones=zones)

    _add_volumetrics(data_dicts, faultblocks=faultblocks, zones=zones, locations=locations)

    db.session.add(field)
    db.session.commit()
