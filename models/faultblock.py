from sqlalchemy import Column, Integer, String, ForeignKey
from models import db


class Faultblock(db.Model):
    __tablename__ = 'faultblock'

    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey('model.id'), nullable=False)
    name = Column(String)


    def __init__(self, **kwargs):
        super(Faultblock, self).__init__(**kwargs)
        # This keeps the default constructor behavior and is only
        # necessary if we want to do something else in the constructor

    def __repr__(self):
        return "<Faultblock(id={id}, model={model_id}, name={name}".format(
            id=self.id, model_id=self.model_id ,name=self.name)
