from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey
from sqlalchemy.orm import relationship

from models import db


class Model(db.Model):
    __tablename__ = 'model'
    __table_args__ = (UniqueConstraint('name', 'user'), )

    id = Column(Integer, primary_key=True)
    name = Column(String)
    user = Column(String)
    field_id = Column(Integer, ForeignKey('field.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    faultblocks = relationship('Faultblock', passive_deletes=True, backref='model')
    zones = relationship('Zone', passive_deletes=True, backref='model')

    def __repr__(self):
        return "<Model(id={id}, name={name}, user={user}".format(id=self.id, name=self.name, user=self.user)
