from sqlalchemy import Column, String, UniqueConstraint
from sqlalchemy.orm import relationship

from models import db


class Field(db.Model):
    __tablename__ = 'field'
    __table_args__ = (UniqueConstraint('name'), )

    name = Column(String, primary_key=True)
    models = relationship('Model', passive_deletes=True, backref='field')
