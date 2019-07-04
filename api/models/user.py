from sqlalchemy import Column, String

from models import db


class User(db.Model):
    __tablename__ = 'user'

    shortname = Column(String, primary_key=True)
