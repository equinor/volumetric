from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from models import db


class Field(db.Model):
    __tablename__ = 'field'

    name = Column(String, primary_key=True)
    cases = relationship('Case', passive_deletes=True, backref='field', cascade="all, delete-orphan")
