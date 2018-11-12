from flask_graphql import GraphQLView
from utils.authentication import get_validated_user
from flask import request

from .schema import schema
from .fileUpload import file_upload


def auth_required(view):
    def wrapper(*args, **kwargs):
        user = get_validated_user()
        request.user = user
        return view(*args, **kwargs)

    return wrapper


def graphql_view():
    view = GraphQLView.as_view('graphql', schema=schema, graphiql=False)
    return auth_required(view)


def file_upload_with_auth():
    user = get_validated_user()
    request.user = user
    return file_upload()


def create_api(app):
    # GraphQL
    app.add_url_rule('/graphql', methods=['POST', 'GET'], view_func=graphql_view())

    app.add_url_rule('/upload', methods=['POST'], view_func=file_upload_with_auth)

    return app
