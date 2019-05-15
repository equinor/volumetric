from sqlalchemy import Column, String, ForeignKey

from models import db


class Role(db.Model):
    __tablename__ = 'role'

    user = Column(String, ForeignKey('user.shortname'), nullable=False, primary_key=True)
    field = Column(String, ForeignKey('field.name'), nullable=False, primary_key=True)
    role = Column(String, default='reader')
