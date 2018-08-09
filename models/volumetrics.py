from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, UniqueConstraint, ForeignKeyConstraint
from models import db


class Volumetrics(db.Model):
    __tablename__ = 'volumetrics'

    id = Column(Integer, primary_key=True)
    realization = Column(Integer)
    location_id = Column(Integer, ForeignKey('location.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    __table_args__ = (UniqueConstraint('realization', 'location_id'), )

    grv = Column(Numeric(20, 2))
    nrv = Column(Numeric(20, 2))
    npv = Column(Numeric(20, 2))
    hcpv = Column(Numeric(20, 2))
    stoiip = Column(Numeric(20, 2))

    def __repr__(self):
        return "<Volumetrics(Realization={realization}, " \
               "grv={grv}, " \
               "nrv={nrv}, " \
               "npv={npv}, " \
               "hcpv={hcpv}, " \
               "stoiip={stoiip}>".format(
            realization=self.realization,
            grv=self.grv,
            nrv=self.nrv,
            npv=self.npv,
            hcpv=self.hcpv,
            stoiip=self.stoiip)
