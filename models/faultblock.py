from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from models import db


class Faultblock(db.Model):
    __tablename__ = 'faultblock'
    __table_args__ = (UniqueConstraint('model_id', 'name'), )

    id = Column(Integer, primary_key=True)
    model_id = Column(
        Integer,
        ForeignKey('model.id', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False)
    name = Column(String)
    locations = relationship('Location', passive_deletes=True)

    def __repr__(self):
        return "<Faultblock(id={id}, model={model_id}, name={name}".format(
            id=self.id, model_id=self.model_id, name=self.name)
