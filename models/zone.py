from sqlalchemy import Column, Integer, String, ForeignKey
from models import db


class Zone(db.Model):
    __tablename__ = 'zone'

    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey('model.id'), nullable=False)
    name = Column(String)


    def __init__(self, **kwargs):
        super(Zone, self).__init__(**kwargs)
        # This keeps the default constructor behavior and is only
        # necessary if we want to do something else in the constructor

    def __repr__(self):
        return "<Zone(id={id}, model={model_id} , name={name}".format(
            id=self.id, model=self.model_id, name=self.name)
