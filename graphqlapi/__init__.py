from flask_graphql import GraphQLView
from utils.authentication import jwt_require

from .schema import schema
from .fileUpload import file_upload


def auth_required(view):
    def wrapper(*args, **kwargs):
        jwt_require()
        return view(*args, **kwargs)
    return wrapper

def graphql_view():
    view = GraphQLView.as_view('graphql', schema=schema, graphiql=True)
    return auth_required(view)


def create_api(app):
    # GraphQL
    app.add_url_rule('/graphql', methods=['POST'], view_func=graphql_view())

    app.add_url_rule('/upload', methods=['POST'], view_func=file_upload)

    return app
