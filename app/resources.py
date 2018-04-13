from flask_restful import Api, Resource
from sqlalchemy import create_engine
from config import Config
from sqlalchemy.orm import sessionmaker
from flask import jsonify
from app.models.user import User
from app import db


engine = db.engine
Session = sessionmaker(bind=engine)


class HelloWorld(Resource):
    def get(self):
        session = Session()
        ed_user = User(name='ed', fullname='Ed Jones', password='edspassword')
        session.add(ed_user)
        session.commit()
        session = Session()
        q = session.query(User).all()
        return jsonify(q)

def create_api(app):
    api = Api(app)
    api.add_resource(HelloWorld, '/')

    return api