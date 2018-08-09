import contextlib
import os

import click
from flask import Flask
from flask_migrate import Migrate

from config import Config
from graphqlapi import create_api
from import_data import import_model

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


def process_model_file(basename, import_dir):
    filepath = os.path.join(import_dir, basename)
    import_model(filepath, field_name=parse_field_name(basename))


@app.cli.command()
@click.pass_context
@click.option('--filename', '-f', type=click.Path(), default=None)
def import_test(ctx, filename):
    import_dir = os.path.join(app.instance_path, 'import')
    ctx.invoke(empty_database)
    if filename:
        process_model_file(filename, import_dir)
    else:
        for basename in os.listdir(import_dir):
            process_model_file(basename, import_dir)
