import contextlib
import os

import click
from flask import Flask
from flask_migrate import Migrate

from config import Config
from graphqlapi import create_api
from models import db, Volumetrics, Model, Location, Field


def create_app():
    # Make the project a Flask application
    app = Flask(__name__)
    # Set Flask config from config.py file
    app.config.from_object(Config)

    db.init_app(app)
    create_api(app)

    return app


if hasattr(Config, 'REMOTE_DEBUG') and Config.REMOTE_DEBUG:
    from utils.debug.remote import enable_remote_debugging

    enable_remote_debugging()

app = create_app()
migrate = Migrate(app, db)


@app.shell_context_processor
def make_shell_context():
    return dict(app=app, db=db, Volumetrics=Volumetrics, Model=Model, Location=Location, Field=Field)


@app.cli.command()
def empty_database():
    meta = db.Model.metadata

    with contextlib.closing(db.engine.connect()) as con:
        trans = con.begin()
        for table in reversed(meta.sorted_tables):
            con.execute(table.delete())
        trans.commit()


def parse_field_name(filename):
    return os.path.splitext(filename.split('_')[-1].capitalize())[0]


def make_import_request(filename, field_name, model_name, model_version='first'):
    from graphene.test import Client
    from graphqlapi import schema
    query = ("""
        mutation ImportModel {{
            importModel(filename: "{filename}", field: "{field_name}", model: "{model_name}", isOfficial: true, officialFromDate: "2012-04-23T18:25:43.511Z", description: "This is a model description", modelType: SEGMENT, modelVersion: "{model_version}") {{
                ok
            }}
        }}
        """.format(filename=filename, field_name=field_name, model_name=model_name, model_version=model_version))
    print(query)
    client = Client(schema)
    response = client.execute(query)
    print(response)


@app.cli.command()
@click.pass_context
def import_test(ctx):
    app.config['UPLOAD_FOLDER'] = 'import'
    ctx.invoke(empty_database)
    make_import_request(
        field_name='Tordis',
        model_name='sf01rms_faciesseed',
        filename='20170127_sf01rms201314_faciesseed_COMPDEPTHUNC_ERT_vols_tordis.txt')
    make_import_request(
        field_name='Maureen', model_name='cce', filename='cce11_unc_ERT_vols_maureen.txt', model_version='11')
    app.config['UPLOAD_FOLDER'] = 'uploads'
