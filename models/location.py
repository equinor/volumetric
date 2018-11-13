from sqlalchemy import Column, String, ForeignKey, UniqueConstraint, Integer
from sqlalchemy.orm import relationship

from models import db


class Location(db.Model):
    __tablename__ = 'location'
    __table_args__ = (UniqueConstraint('case_id', 'region_name', 'zone_name', 'facies_name', 'license'), )

    id = Column(Integer, primary_key=True)
    case_id = Column(Integer, ForeignKey('case.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    region_name = Column(String)
    zone_name = Column(String)
    facies_name = Column(String)
    license = Column(String)
    realizations = relationship('Realization', passive_deletes=True)
