from utils.file import read_file
from utils.timer import timeit
from models import Model, Faultblock, Zone, Location, Volumetrics, db, Field


@timeit
def import_file(filename, user_name='test', field_name='Tordis'):
    # Keep track which indices have been added
    lines_as_ordered_dicts = read_file(filename)
    fields = []
    models = []
    faultblocks = []
    zones = []
    locations = []
    for line_dict in lines_as_ordered_dicts:
        # Don't add totals, as that is something we should be able to compute from the rest of the data
        if line_dict['Zone'] == 'Totals' or line_dict['Faultblock'] == 'Totals':
            continue

        if field_name not in fields:
            field = Field(name=field_name)
            db.session.add(field)
            db.session.commit()
            fields.append(field_name)

        model_name = line_dict['Model']
        if model_name not in models:
            models.append(model_name)
            model = Model(name=model_name, user=user_name, field_id=field.id)
            db.session.add(model)
            db.session.commit()

        faultblock_name = line_dict['Faultblock']
        if faultblock_name not in faultblocks:
            faultblocks.append(faultblock_name)
            faultblock = Faultblock(name=faultblock_name)
            faultblock.model_id = model.id
            db.session.add(faultblock)
            db.session.commit()

        zone_name = line_dict['Zone']
        if zone_name not in zones:
            zones.append(zone_name)
            zone = Zone(name=zone_name)
            zone.model_id = model.id
            db.session.add(zone)
            db.session.commit()

        location = Location()
        location.faultblock_id = faultblock.id
        location.zone_id = zone.id
        location.facies = None
        if location not in locations:
            locations.append(location)
            db.session.add(location)
            db.session.commit()

        volumetrics = Volumetrics(
            grv=line_dict['GRV'],
            nrv=line_dict['NRV'],
            npv=line_dict['NPV'],
            hcpv=line_dict['HCPV'],
            stoiip=line_dict['STOIIP'],
            realization=line_dict['Realization'])
        volumetrics.location_id = location.id
        db.session.add(volumetrics)
        db.session.commit()
