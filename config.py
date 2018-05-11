import os


class Config(object):
    PORT = int(os.environ.get('API_PORT', '80'))
    POSTGRES_HOSTNAME = os.environ.get('DATABASE_HOST', 'db')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
    POSTGRES_USER = os.environ.get('POSTGRES_USER', 'volumetric')
    POSTGRES_DB = os.environ.get('POSTGRES_DB', POSTGRES_USER)
    POSTGRES_PORT = os.environ.get('DATABASE_PORT', '5432')
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'something')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = "postgresql://{username}:{password}@{hostname}:{port}/{database}" \
        .format(username=POSTGRES_USER, password=POSTGRES_PASSWORD, hostname=POSTGRES_HOSTNAME,
                port=POSTGRES_PORT, database=POSTGRES_DB)

    # Remote debugging
    REMOTE_DEBUG = False

    print("These ENVIRONMENTS are set from docker-compose:")
    print("API PORT: " + str(PORT))
    print("Postgres Hostname: " + POSTGRES_HOSTNAME)
    print("Postgres Port: " + POSTGRES_PORT)
    print("Postgres Database: " + POSTGRES_DB)
    print("Postgres User: " + POSTGRES_USER)
    print("Postgres Password: [OMITTED] ")
