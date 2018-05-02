from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
from models.model import Model
from models.zone import Zone
from models.faultblock import Faultblock
from models.location import Location
from models.volumetrics import Volumetrics
