from sqlalchemy import Column, String, ForeignKey, UniqueConstraint, Integer
from sqlalchemy.orm import relationship

from models import db


class Location(db.Model):
    __tablename__ = 'location'
    __table_args__ = (UniqueConstraint('model_id', 'faultblock_name', 'zone_name', 'facies_name'), )

    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey('model.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    faultblock_name = Column(String)
    zone_name = Column(String)
    facies_name = Column(String)
    volumetrics = relationship('Volumetrics', passive_deletes=True)
