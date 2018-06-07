from behave import *
from models import Model, Faultblock, Zone, Location, Volumetrics, db, Field


@given(u'there are fields')
def step_impl(context):
    context.fields = {}
    for row in context.table:
        name = row['name']
        kwargs = {
            'name': name,
        }
        field = Field(**kwargs)
        context.fields[name] = field
        db.session.add(field)
    db.session.commit()


@given(u'there are models')
def step_impl(context):
    context.models = {}
    for row in context.table:
        name = row['name']
        user = row['user']
        kwargs = {
            'name': name,
            'user': user,
            'field': context.fields[row['field']]
        }
        model = Model(**kwargs)
        context.models[name] = model
        db.session.add(model)
    db.session.commit()


@given(u'there are fault blocks')
def step_impl(context):
    context.fault_blocks = {}
    for row in context.table:
        name = row['name']
        kwargs = {
            'name': name,
            'model': context.models[row['model']]
        }
        fault_block = Faultblock(**kwargs)
        context.fault_blocks[name] = fault_block
        db.session.add(fault_block)
    db.session.commit()


@given(u'there are zones')
def step_impl(context):
    context.zones = {}
    for row in context.table:
        name = row['name']
        kwargs = {
            'name': name,
            'model': context.models[row['model']]
        }
        zone = Zone(**kwargs)
        context.zones[name] = zone
        db.session.add(zone)
    db.session.commit()


@given(u'there are locations')
def step_impl(context):
    context.locations = {}
    id = 0
    for row in context.table:
        kwargs = {
            'faultblock': context.fault_blocks[row['fault_block']],
            'zone': context.zones[row['zone']],
            'facies': row['facies']
        }
        location = Location(**kwargs)
        context.locations[str(id)] = location
        db.session.add(location)
        id = id + 1
    db.session.commit()


@given(u'there are volumetrics')
def step_impl(context):
    for row in context.table:
        kwargs = {
            'location_id': context.locations[row['location_id']].id,
            'realization': int(row['realization']),
            'grv': float(row['grv']),
            'nrv': float(row['nrv']),
            'npv': float(row['npv']),
            'hcpv': float(row['hcpv']),
            'stoiip': float(row['stoiip'])
        }
        location = Volumetrics(**kwargs)
        db.session.add(location)
    db.session.commit()
