from sqlalchemy import Column, Integer, String, ForeignKey
from models import db


class Location(db.Model):
    __tablename__ = 'location'

    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey('model.id'), nullable=False)
    faultblock_id = Column(Integer, ForeignKey('faultblock.id'), nullable=False)
    zone_id = Column(Integer, ForeignKey('zone.id'), nullable=False)
    facies = Column(String)

    def __init__(self, **kwargs):
        super(Location, self).__init__(**kwargs)
        # This keeps the default constructor behavior and is only
        # necessary if we want to do something else in the constructor

    def __repr__(self):
        return "<Location(id={id}, Model={model_id}, Faultblock_id={faultblock_id}, Zone_id={zone_id}, Facies={facies}>".format(
            id=self.id, model_id=self.model_id, faultblock_id=self.faultblock_id, zone_id=self.zone_id, facies=self.facies)
