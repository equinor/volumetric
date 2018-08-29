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
        model_version = row['model_version']
        model_type = row['model_type']
        description = row['description']
        created_user = row['created_user']
        is_official = row['is_official'] == 'True'
        model = Model(
            name=name,
            model_version=model_version,
            model_type=model_type,
            description=description,
            created_user=created_user,
            is_official=is_official,
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
            model_id=row['model_id'],
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
