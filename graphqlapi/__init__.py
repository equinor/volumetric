from flask_graphql import GraphQLView

from .schema import schema
from .fileUpload import file_upload


def create_api(app):
    # GraphQL
    app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

    app.add_url_rule('/upload', methods=['POST'], view_func=file_upload)

    return app
