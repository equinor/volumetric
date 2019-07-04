import enum

import graphene
from sqlalchemy import Column, Integer, Numeric, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.orm import relationship

from models import db


class PhaseEnum(str, enum.Enum):
    OIL: str = 'OIL'
    GAS: str = 'GAS'
    TOTAL: str = 'TOTAL'


PhaseEnumGraphene = graphene.Enum.from_enum(PhaseEnum)


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


class MaxIterVolumetrics(db.Model):
    __tablename__ = 'max_iter_volumetrics'

    location_id = Column(Integer, primary_key=True)
    location = relationship(
        'Location',
        primaryjoin='MaxIterVolumetrics.location_id==Location.id',
        foreign_keys='MaxIterVolumetrics.location_id')
    realization_id = Column(Integer, primary_key=True)
    phase = Column(Enum(PhaseEnum), primary_key=True)
    realization = Column(Integer)
    bulk = Column(Numeric(20, 2))
    net = Column(Numeric(20, 2))
    porv = Column(Numeric(20, 2))
    hcpv = Column(Numeric(20, 2))
    stoiip = Column(Numeric(20, 2))
    giip = Column(Numeric(20, 2))
    associatedgas = Column(Numeric(20, 2))
    associatedliquid = Column(Numeric(20, 2))
    recoverable = Column(Numeric(20, 2))
