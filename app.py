from flask import Flask
from flask_graphql import GraphQLView

from config import Config
#from graphqlapi.schema import schema


def create_app():
    # Make the project a Flask application
    app = Flask(__name__)
    # Set Flask config from config.py file
    app.config.from_object(Config)

    from models import db
    db.init_app(app)

    return app


if hasattr(Config, 'REMOTE_DEBUG') and Config.REMOTE_DEBUG:
    from utils.debug.remote import enable_remote_debugging

    enable_remote_debugging()

app = create_app()

# GraphQL
#app.add_url_rule(
 #   '/graphql',
  #  view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

# Start the application
if __name__ == '__main__':
    print("######################################################")
    print("######################################################")
    print(f'Starting the Flask application on port {Config.PORT}')
    app.run(debug=True, host='0.0.0.0', port=Config.PORT)
