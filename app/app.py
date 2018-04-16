from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_graphql import GraphQLView
from app.graphqlapi.schema import schema
from time import sleep


print("######################################################")
print("######################################################")

# Make the project a Flask application
app = Flask(__name__)
# Set Flask config from config.py file
app.config.from_object(Config)

# Initiate the database as a SQLAlchemy managed Database
db = SQLAlchemy(app)




# Enable the flask_migrate package
migrate = Migrate(app, db)

# Create the database schema from all the models
from app.models import *

# Test if database is ready
try:
    db.create_all()
except:
    print("FATAL: Failed to write to database.")
    print("Exiting...")
    sleep(5)
    exit(1)

# Create all API-Endpoints
#from app import resources
#resources.create_api(app)

##################################
me = user.User(name='stig',fullname='stig ofstad',password='mypasswd')
metric = metric.Metric(model="absdds",realization="8", faultblock="faulblobk", zone="2510ToridisMidtre", grv="123.00",nrv="456.98", npv="765.897", hcpv="0.00",stoiip="2.2")
db.session.add(me)
db.session.add(metric)
db.session.commit()


# GraphQL Tests
app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

##################################
# Start the application
#if __name__ == '__main__':
print("Starting the Flask application")
app.run(debug=True, host='0.0.0.0', port=Config.PORT)
