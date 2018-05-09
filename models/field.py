from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from models import db


class Field(db.Model):
    __tablename__ = 'field'
    __table_args__ = (UniqueConstraint('name'), )

    id = Column(Integer, primary_key=True)
    name = Column(String)
    field = relationship('Model', passive_deletes=True, backref='field')
