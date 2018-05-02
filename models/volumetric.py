from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from models import db


class Volumetrics(db.Model):
    __tablename__ = 'volumetrics'

    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey('model.id'), nullable=False)
    faultblock_id = Column(Integer, ForeignKey('faultblock.id'), nullable=False)
    zone_id = Column(Integer, ForeignKey('zone.id'), nullable=False)
    location_id = Column(Integer, ForeignKey('location.id'), nullable=False)
    realization = Column(Integer)
    grv = Column(Numeric(20, 2))
    nrv = Column(Numeric(20, 2))
    npv = Column(Numeric(20, 2))
    hcpv = Column(Numeric(20, 2))
    stoiip = Column(Numeric(20, 2))


    def __init__(self, **kwargs):
        super(Volumetrics, self).__init__(**kwargs)
        # This keeps the default constructor behavior and is only
        # necessary if we want to do something else in the constructor

    def __repr__(self):
        return "<Volumetrics(id={id}, Faultblock_id={faultblock_id}, Zone_id={zone_id}, Facies={facies}," \
               " Realization={realization}, grv={grv}, nrv={nrv}, npv={npv}, hcpv={hcpv}, stoiip={stoiip}>".format(
            id=self.id, faultblock_id=self.faultblock_id, zone_id=self.zone_id, facies=self.facies,
            realization=self.realization, grv=self.grv, nrv=self.nrv, npv=self.npv, hcpv=self.hcpv, stoiip=self.stoiip)
