from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey

from models import db


class Task(db.Model):
    __tablename__ = 'tasks'

    id = Column(String(36), primary_key=True)
    user = Column(String)
    case_name = Column(String)
    queued_at = Column(DateTime)
    complete = Column(Boolean, default=False)
    failed = Column(Boolean, default=False)
    message = Column(String)
    filename = Column(String)
    filehash = Column(String)
    field_name = Column(String, ForeignKey('field.name', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
