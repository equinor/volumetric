import enum
from datetime import datetime

from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime, Integer, Enum
from sqlalchemy.orm import relationship

from models import db


class CaseTypeEnum(str, enum.Enum):
    SEGMENT: str = 'SEGMENT'
    FULL_FIELD: str = 'FULL_FIELD'


class Case(db.Model):
    __tablename__ = 'case'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    created_user = Column(String, nullable=False)
    created_date = Column(DateTime, default=datetime.utcnow)
    case_type = Column(Enum(CaseTypeEnum), nullable=False)
    case_version = Column(String, nullable=False)
    description = Column(String)
    is_official = Column(Boolean, default=False)
    official_from_date = Column(DateTime, default=datetime.utcnow)
    official_to_date = Column(DateTime)
    field_name = Column(String, ForeignKey('field.name', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    locations = relationship('Location', passive_deletes=True, backref='case')

    @property
    def is_currently_official(self):
        return self.is_official and (self.official_to_date is None or self.official_to_date >= datetime.now())
