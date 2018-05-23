from sqlalchemy import Column, Integer, Numeric, ForeignKey, UniqueConstraint
from models import db


class Volumetrics(db.Model):
    __tablename__ = 'volumetrics'
    __table_args__ = (UniqueConstraint('location_id', 'realization'), )

    id = Column(Integer, primary_key=True)
    location_id = Column(Integer, ForeignKey('location.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    realization = Column(Integer)
    grv = Column(Numeric(20, 2))
    nrv = Column(Numeric(20, 2))
    npv = Column(Numeric(20, 2))
    hcpv = Column(Numeric(20, 2))
    stoiip = Column(Numeric(20, 2))

    def __repr__(self):
        return "<Volumetrics(id={id}, location_id={location_id}, Facies={facies}, Realization={realization}, grv={grv}, nrv={nrv}, npv={npv}, hcpv={hcpv}, stoiip={stoiip}>".format(
            id=self.id,
            location_id=self.location_id,
            facies=self.facies,
            realization=self.realization,
            grv=self.grv,
            nrv=self.nrv,
            npv=self.npv,
            hcpv=self.hcpv,
            stoiip=self.stoiip)
