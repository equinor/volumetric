from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
from models.field import Field
from models.model import Model
from models.location import Location
from models.volumetrics import Volumetrics
