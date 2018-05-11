from flask_graphql import GraphQLView
from graphqlapi.schema import schema


def create_api(app):
    # GraphQL
    app.add_url_rule(
        '/graphql',
        view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))
    return app
