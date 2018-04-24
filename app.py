from time import sleep

from flask import Flask
from flask_graphql import GraphQLView

from config import Config
from flask_migrate import Migrate
from graphqlapi.schema import schema


# import logging

# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

def create_app():
    # Make the project a Flask application
    app = Flask(__name__)
    # Set Flask config from config.py file
    app.config.from_object(Config)

    from models import db
    with app.app_context():
        db.init_app(app)
        # Enable the flask_migrate package
        migrate = Migrate(app, db)

        return app, migrate


def create_test_db():
    # Create the database schema from all the models
    from models import db, User, Metric
    with app.app_context():
        # Test if database is ready
        try:
            db.create_all()
        except:
            print("FATAL: Failed to write to database.")
            print("Exiting...")
            sleep(5)
            exit(1)

        me = User(name='stig', fullname='stig ofstad', password='mypasswd')
        metric = Metric(model="absdds", realization="8", faultblock="faulblobk", zone="2510ToridisMidtre",
                        grv="123.00", nrv="456.98", npv="765.897", hcpv="0.00", stoiip="2.2")
        db.session.add(me)
        db.session.add(metric)
        db.session.commit()


app, migrate = create_app()

if 'REMOTE_DEBUG' in app.config and app.config['REMOTE_DEBUG']:
    from utils.debug.remote import enable_remote_debugging

    enable_remote_debugging()

create_test_db()

# GraphQL
app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

# Start the application
if __name__ == '__main__':
    print("######################################################")
    print("######################################################")
    print(f'Starting the Flask application on port {Config.PORT}')
    app.run(debug=True, host='0.0.0.0', port=Config.PORT)
