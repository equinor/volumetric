from psycopg2._psycopg import ProgrammingError

from app import create_app
from models import db
from tests_bdd.results import print_overview_features
import contextlib
from flask_migrate import Migrate, upgrade
import os

app = create_app()
app.config['TESTING'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = (f'postgresql://volumetric:{os.environ.get("POSTGRES_PASSWORD", "volumetric")}'
                                         f'@db:5432/volumetric')

migrate = Migrate(app, db)


def clear():
    meta = db.Model.metadata

    with contextlib.closing(db.engine.connect()) as con:
        trans = con.begin()
        for table in reversed(meta.sorted_tables):
            if table.name != 'max_iter_volumetrics':
                con.execute(table.delete())
        for seq in ['case', 'location', 'realization', 'volumetrics']:
            con.execute(f'ALTER SEQUENCE {seq}_id_seq RESTART WITH 1')  # Needed when using PostgreSQL
        db.session.execute('REFRESH MATERIALIZED VIEW max_iter_volumetrics')
        trans.commit()


def before_all(context):
    context.errors = []
    context.features = []
    with app.app_context():
        upgrade(revision="head")
        clear()


def after_all(context):
    print_overview_features(context.features)


def after_feature(context, feature):
    context.features.append(feature)


def before_scenario(context, scenario):
    context.client = app.test_client()
    context.ctx = app.test_request_context()
    context.ctx.push()


def after_scenario(context, scenario):
    db.session.close()
    clear()
    context.ctx.pop()


def after_step(context, step):
    if step.status == 'failed':
        context.errors.append(step)
