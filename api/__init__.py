from flask_graphql import GraphQLView
from utils.authentication import get_validated_user
from flask import request

from api.graphql.schema import schema
from api.rest.cases import case_endpoint
from .file_upload import file_upload


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


def case_endpoint_with_auth(case_id):
    user = get_validated_user()
    request.user = user
    return case_endpoint(case_id)


def create_api(app):
    app.add_url_rule('/graphql', methods=['POST', 'GET'], view_func=graphql_view())

    app.add_url_rule('/upload', methods=['POST'], view_func=file_upload_with_auth)

    app.add_url_rule('/case/<case_id>', methods=['GET'], view_func=case_endpoint_with_auth)

    return app
