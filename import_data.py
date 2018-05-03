import csv
from models import Model, Faultblock, Zone, Location, Volumetrics, db


def import_file(filename, user_name='test'):
    with open(filename, 'r') as file:
        reader = csv.DictReader(file, delimiter=" ")
        lines_as_ordered_dicts = [line for line in reader]
        # Store which indices have been added
        models = []
        faultblocks = []
        zones = []
        locations = []
        for line_dict in lines_as_ordered_dicts:
            # Don't add totals, as that is something we should be able to compute from the rest of the data
            if line_dict['Zone'] == 'Totals':
                continue

            model_name = line_dict['Model']
            if model_name not in models:
                models.append(model_name)
                model = Model(name=model_name, user=user_name)
                db.session.add(model)
                db.session.commit()
                db.session.refresh(model)

            model_id = (Model.query.filter_by(name=model_name).first()).id

            faultblock_name = line_dict['Faultblock']
            if faultblock_name not in faultblocks:
                faultblocks.append(faultblock_name)
                faultblock = Faultblock(name=faultblock_name)
                faultblock.model_id = model_id
                db.session.add(faultblock)
                db.session.commit()

            zone_name = line_dict['Zone']
            if zone_name not in zones:
                zones.append(zone_name)
                zone = Zone(name=zone_name)
                zone.model_id = model_id
                db.session.add(zone)
                db.session.commit()

            location = Location()
            faultblock_id = (
                Faultblock.query.filter_by(name=faultblock_name).first()).id
            location.faultblock_id = faultblock_id
            zone_id = (Zone.query.filter_by(name=zone_name).first()).id
            location.zone_id = zone_id
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
