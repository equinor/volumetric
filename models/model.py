from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from models import db


class Model(db.Model):
    __tablename__ = 'model'
    __table_args__ = (UniqueConstraint('name', 'user'), )

    id = Column(Integer, primary_key=True)
    name = Column(String)
    user = Column(String)
    faultblocks = relationship('Faultblock', passive_deletes=True)
    zones = relationship('Zone', passive_deletes=True)

    def __repr__(self):
        return "<Model(id={id}, name={name}, user={user}".format(
            id=self.id, name=self.name, user=self.user)
