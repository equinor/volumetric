from sqlalchemy import Column, String, UniqueConstraint, ForeignKey
from sqlalchemy.orm import relationship

from models import db


class Model(db.Model):
    __tablename__ = 'model'
    __table_args__ = (UniqueConstraint('name', 'user'), )

    name = Column(String, primary_key=True)
    user = Column(String)
    field_name = Column(String, ForeignKey('field.name', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    locations = relationship('Location', passive_deletes=True, backref='model')

    def __repr__(self):
        return "<Model(name={name}, user={user}".format(name=self.name, user=self.user)
