from behave import *
from models import Case, Location, Volumetrics, db, Field, Realization


@given(u'there are fields')
def step_impl(context):
    context.fields = {}
    for row in context.table:
        name = row['name']
        field = Field(name=name, )
        context.fields[name] = field
        db.session.add(field)
    db.session.commit()


@given(u'there are cases')
def step_impl(context):
    context.cases = {}
    for row in context.table:
        name = row['name']
        case_version = row['case_version']
        case_type = row['case_type']
        description = row['description']
        created_user = row['created_user']
        is_official = row['is_official'] == 'True'
        case = Case(
            name=name,
            case_version=case_version,
            case_type=case_type,
            description=description,
            created_user=created_user,
            is_official=is_official,
            field=context.fields[row['field']],
        )
        context.cases[name] = case
        db.session.add(case)
    db.session.commit()


@given(u'there are locations')
def step_impl(context):
    context.locations = {}
    id = 1
    for row in context.table:
        location = Location(
            region_name=row['region_name'],
            zone_name=row['zone_name'],
            facies_name=row['facies_name'],
            case_id=row['case_id'],
        )
        context.locations[str(id)] = location
        db.session.add(location)
        id = id + 1
    db.session.commit()


@given(u'there are volumetrics')
def step_impl(context):
    for row in context.table:
        location = Volumetrics(
            realization_id=int(context.realizations[row['realization_id']].id),
            bulk=float(row['bulk']),
            net=float(row['net']),
            porv=float(row['porv']),
            hcpv=float(row['hcpv']),
            stoiip=float(row['stoiip']),
            phase=row['phase'],
            giip=float(row['giip']),
            associatedgas=float(row['associatedgas']),
            associatedliquid=float(row['associatedliquid']),
            recoverable=float(row['recoverable']),
        )
        db.session.add(location)
    db.session.commit()


@given("there are realizations")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.realizations = {}
    id = 1
    for row in context.table:
        realization = Realization(
            location_id=int(context.locations[row['location_id']].id),
            realization=int(row['realization']),
            iteration=int(row['iteration']),
        )
        context.realizations[str(id)] = realization
        db.session.add(realization)
        id = id + 1
    db.session.commit()
