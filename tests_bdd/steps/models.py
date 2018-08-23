from behave import *
from models import Model, Location, Volumetrics, db, Field


@given(u'there are fields')
def step_impl(context):
    context.fields = {}
    for row in context.table:
        name = row['name']
        field = Field(name=name, )
        context.fields[name] = field
        db.session.add(field)
    db.session.commit()


@given(u'there are models')
def step_impl(context):
    context.models = {}
    for row in context.table:
        name = row['name']
        user = row['user']
        model = Model(
            name=name,
            user=user,
            field=context.fields[row['field']],
        )
        context.models[name] = model
        db.session.add(model)
    db.session.commit()


@given(u'there are locations')
def step_impl(context):
    context.locations = {}
    id = 1
    for row in context.table:
        location = Location(
            faultblock_name=row['faultblock_name'],
            zone_name=row['zone_name'],
            facies_name=row['facies_name'],
            model_name=row['model_name'],
        )
        context.locations[str(id)] = location
        db.session.add(location)
        id = id + 1
    db.session.commit()


@given(u'there are volumetrics')
def step_impl(context):
    for row in context.table:
        location = Volumetrics(
            location_id=int(context.locations[row['location_id']].id),
            realization=int(row['realization']),
            grv=float(row['grv']),
            nrv=float(row['nrv']),
            npv=float(row['npv']),
            hcpv=float(row['hcpv']),
            stoiip=float(row['stoiip']),
        )
        db.session.add(location)
    db.session.commit()
