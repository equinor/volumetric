from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from models import db


class Zone(db.Model):
    __tablename__ = 'zone'
    __table_args__ = (UniqueConstraint('model_id', 'name'), )

    id = Column(Integer, primary_key=True)
    name = Column(String)
    model_id = Column(Integer, ForeignKey('model.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    locations = relationship('Location', passive_deletes=True, backref='zone')

    def __repr__(self):
        return "<Zone(id={id}, model={model_id} , name={name}".format(
            id=self.id, model_id=self.model_id, name=self.name)
