from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from models import db


class Location(db.Model):
    __tablename__ = 'location'
    __table_args__ = (UniqueConstraint('faultblock_id', 'zone_id'), )

    id = Column(Integer, primary_key=True)
    faultblock_id = Column(
        Integer,
        ForeignKey('faultblock.id', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False)
    zone_id = Column(
        Integer,
        ForeignKey('zone.id', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False)
    facies = Column(String, nullable=True)
    volumetrics = relationship('Volumetrics', passive_deletes=True)

    def __repr__(self):
        return "<Location(id={id}, Faultblock_id={faultblock_id}, Zone_id={zone_id}, Facies={facies}>".format(
            id=self.id,
            faultblock_id=self.faultblock_id,
            zone_id=self.zone_id,
            facies=self.facies)
