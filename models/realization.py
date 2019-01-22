from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from models import db


class Realization(db.Model):
    __tablename__ = 'realization'
    __table_args__ = (UniqueConstraint('realization', 'location_id', 'iteration'), )

    id = Column(Integer, primary_key=True)
    realization = Column(Integer, server_default="1")
    iteration = Column(Integer, server_default="1")
    location_id = Column(Integer, ForeignKey('location.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    volumetrics = relationship('Volumetrics', backref='realization', passive_deletes=True)
