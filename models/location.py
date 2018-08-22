from sqlalchemy import Column, String, ForeignKey, UniqueConstraint, Integer
from sqlalchemy.orm import relationship

from models import db


class Location(db.Model):
    __tablename__ = 'location'
    __table_args__ = (UniqueConstraint('model_name', 'faultblock_name', 'zone_name', 'facies_name'), )

    id = Column(Integer, primary_key=True)
    model_name = Column(String, ForeignKey('model.name', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    faultblock_name = Column(String)
    zone_name = Column(String)
    facies_name = Column(String)
    volumetrics = relationship('Volumetrics', passive_deletes=True)

    def __repr__(self):
        return "<Location(Faultblock_name={faultblock_name}," \
               "Zone_name={zone_name}," \
               "facies_name={facies_name}," \
               "Volumetrics={volumetrics}>".format(
            faultblock_name=self.faultblock_name,
            zone_name=self.zone_name,
            facies_name=self.facies_name,
            volumetrics=self.volumetrics)
