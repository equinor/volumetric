from sqlalchemy import Column, Integer, String
from models import db


class Model(db.Model):
    __tablename__ = 'model'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    user = Column(String)



    def __init__(self, **kwargs):
        super(Model, self).__init__(**kwargs)
        # This keeps the default constructor behavior and is only
        # necessary if we want to do something else in the constructor

    def __repr__(self):
        return "<Model(id={id}, name={name}, user={user}".format(
            id=self.id, name=self.name, user=self.user)
