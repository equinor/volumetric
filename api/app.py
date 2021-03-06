import contextlib
import os
from logging.config import dictConfig

import click
from flask import Flask
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from graphene.test import Client

from config import Config
from models import db, Volumetrics, Case, Location, Field, Realization
from utils.authentication import User
from utils.graphql.context import Context


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app


if hasattr(Config, 'REMOTE_DEBUG') and Config.REMOTE_DEBUG:
    from utils.debug.remote import enable_remote_debugging

    enable_remote_debugging()

dictConfig({
    'version': 1,
    'formatters': {
        'default': {
            'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
        }
    },
    'handlers': {
        'wsgi': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://flask.logging.wsgi_errors_stream',
            'formatter': 'default'
        }
    },
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = create_app()
migrate = Migrate(app, db)
marshmallow = Marshmallow(app)

from api import create_api, schema

create_api(app)


@app.shell_context_processor
def make_shell_context():
    return dict(
        app=app, db=db, Volumetrics=Volumetrics, Realization=Realization, Case=Case, Location=Location, Field=Field)


@app.cli.command()
def empty_database():
    meta = db.Model.metadata

    with contextlib.closing(db.engine.connect()) as con:
        trans = con.begin()
        for table in reversed(meta.sorted_tables):
            if table.name != 'max_iter_volumetrics':
                con.execute(table.delete())

        con.execute('REFRESH MATERIALIZED VIEW max_iter_volumetrics')
        trans.commit()


def parse_field_name(filename):
    return os.path.splitext(filename.split('_')[-1].capitalize())[0]


def make_import_request(filename, field_name, case_name, file_format='FMU', case_version='first'):
    from graphene.test import Client
    from api import schema
    query = ("""
        mutation ImportCase {{
            importCase(filename: "{filename}", field: "{field_name}", case: "{case_name}", isOfficial: true, officialFromDate: "2012-04-23T18:25:43.511Z", description: "This is a case description", caseType: SEGMENT, caseVersion: "{case_version}", fileFormat: {file_format}) {{
                ok
            }}
        }}
        """.format(
        filename=filename,
        field_name=field_name,
        case_name=case_name,
        case_version=case_version,
        file_format=file_format))
    print(query)
    client = Client(schema)
    response = client.execute(
        query, context=Context(user=User(name='An On', shortname='anon', roles=['VolumetricAdmin'])))
    print(response)


def add_fields(fields):
    client = Client(schema)
    for field in fields:
        client.execute(
            """
        mutation AddField {{
            addField(name: "{field_name}") {{
                ok
            }}
        }}
        """.format(field_name=field),
            context=Context(user=User(name='An On', shortname='anon', roles=['VolumetricAdmin'])))


@app.cli.command()
@click.pass_context
def import_test(ctx):
    app.config['UPLOAD_FOLDER'] = 'import'
    ctx.invoke(empty_database)
    add_fields(['Tordis', 'Maureen', 'FMU Field'])
    make_import_request(
        field_name='Tordis',
        case_name='sf01rms_faciesseed',
        filename='20170127_sf01rms201314_faciesseed_COMPDEPTHUNC_ERT_vols_tordis.txt',
        file_format='CUSTOM')
    make_import_request(
        field_name='Maureen',
        case_name='cce',
        filename='cce11_unc_ERT_vols_maureen.txt',
        case_version='11',
        file_format='CUSTOM')
    make_import_request(
        field_name='FMU Field', filename='FMU_VOLS.csv', case_name='0', case_version='final', file_format='FMU')
    app.config['UPLOAD_FOLDER'] = 'uploads'
