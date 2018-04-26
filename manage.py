import contextlib

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from app import app
from import_data import import_file
from models import db

manager = Manager(app)
migrate = Migrate(app, db)
manager.add_command('db', MigrateCommand)


@manager.command
def empty_database():
    meta = db.Model.metadata

    with contextlib.closing(db.engine.connect()) as con:
        trans = con.begin()
        for table in reversed(meta.sorted_tables):
            con.execute(table.delete())
        trans.commit()


@manager.command
def import_test():
    empty_database()
    import_file('TestData.txt')


if __name__ == "__main__":
    manager.run()
