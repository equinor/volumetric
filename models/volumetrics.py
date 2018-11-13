import enum

from sqlalchemy import Column, Integer, Numeric, ForeignKey, UniqueConstraint, Enum

from models import db


class PhaseEnum(enum.Enum):
    OIL = 1
    GAS = 2
    TOTAL = 3


class Volumetrics(db.Model):
    __tablename__ = 'volumetrics'

    id = Column(Integer, primary_key=True)
    phase = Column(Enum(PhaseEnum))
    realization_id = Column(
        Integer, ForeignKey('realization.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    __table_args__ = (UniqueConstraint('realization_id', 'phase'), )

    bulk = Column(Numeric(20, 2))
    net = Column(Numeric(20, 2))
    porv = Column(Numeric(20, 2))
    hcpv = Column(Numeric(20, 2))
    stoiip = Column(Numeric(20, 2))
    giip = Column(Numeric(20, 2))
    associatedgas = Column(Numeric(20, 2))
    associatedliquid = Column(Numeric(20, 2))
    recoverable = Column(Numeric(20, 2))
