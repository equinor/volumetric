from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
#import logging

#logging.basicConfig()
#logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)


# Make the project a Flask application
app = Flask(__name__)
# Set Flask config from config.py file
app.config.from_object(Config)

# Initiate the database as a SQLAlchemy managed Database
db = SQLAlchemy(app)


migrate = Migrate(app, db)

# Create the database schema from all the models
from app.models import *
db.create_all()

# Create all API-Endpoints
from app import resources
resources.create_api(app)

#from app import routes

# Start the application
app.run(debug=True, host='0.0.0.0', port=Config.PORT)
