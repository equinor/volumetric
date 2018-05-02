import csv
from models import Metric, db


def import_file(filename):
    with open(filename, 'r') as file:
        reader = csv.DictReader(file, delimiter=" ")
        lines_as_ordered_dicts = [line for line in reader]
        metrics = []
        for line_dict in lines_as_ordered_dicts:
            metrics.append(
                Metric(
                    model=line_dict['Model'],
                    realization=line_dict['Realization'],
                    faultblock=line_dict['Faultblock'],
                    zone=line_dict['Zone'],
                    grv=line_dict['GRV'],
                    nrv=line_dict['NRV'],
                    npv=line_dict['NPV'],
                    hcpv=line_dict['HCPV'],
                    stoiip=line_dict['STOIIP'],
                ))
        db.session.bulk_save_objects(metrics)
        db.session.commit()
