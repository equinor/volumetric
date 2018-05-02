from sqlalchemy import Column, Integer, String, Numeric
from models import db


class Metric(db.Model):
    __tablename__ = 'metrics'

    id = Column(Integer, primary_key=True)
    model = Column(String)
    realization = Column(Integer)
    faultblock = Column(String)
    zone = Column(String)
    grv = Column(Numeric(20, 2))
    nrv = Column(Numeric(20, 2))
    npv = Column(Numeric(20, 2))
    hcpv = Column(Numeric(20, 2))
    stoiip = Column(Numeric(20, 2))

    def __init__(self, **kwargs):
        super(Metric, self).__init__(**kwargs)
        # This keeps the default constructor behavior and is only
        # necessary if we want to do something else in the constructor

    def __repr__(self):
        return "<Metrics(id={id}, model={model}, realization={realization}, faultblock={faultblock}, zone={zone}, grv={grv}, nrv={nrv}, npv={npv}, hcpv={hcpv}, stoiip={stoiip})".format(
            id=self.id,
            model=self.model,
            realization=self.realization,
            faultblock=self.faultblock,
            zone=self.zone,
            grv=self.grv,
            nrv=self.nrv,
            npv=self.npv,
            hcpv=self.hcpv,
            stoiip=self.stoiip)
