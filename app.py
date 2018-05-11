import contextlib

import click
from flask import Flask
from flask_migrate import Migrate

from config import Config
from graphqlapi import create_api
from import_data import import_file

from models import db, Volumetrics, Model, Faultblock, Location, Zone, Field


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
    return dict(
        app=app,
        db=db,
        Volumetrics=Volumetrics,
        Model=Model,
        Faultblock=Faultblock,
        Location=Location,
        Zone=Zone,
        Field=Field)


@app.cli.command()
def empty_database():
    meta = db.Model.metadata

    with contextlib.closing(db.engine.connect()) as con:
        trans = con.begin()
        for table in reversed(meta.sorted_tables):
            con.execute(table.delete())
        trans.commit()


@app.cli.command()
@click.pass_context
def import_test(ctx):
    ctx.invoke(empty_database)
    import_file('TestData.txt')
