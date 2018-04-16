from flask_restful import Api, Resource
from sqlalchemy.orm import sessionmaker
from app.app import db


engine = db.engine
Session = sessionmaker(bind=engine)


class HelloWorld(Resource):
    def get(self):

        return "Hello World!"

class Import(Resource):
    def get(self):
        import import_test
        import_test()
        return "Hello World!"

def create_api(app):
    api = Api(app)
    api.add_resource(HelloWorld, '/')
    api.add_resource(HelloWorld, '/MakeDB')

    return api