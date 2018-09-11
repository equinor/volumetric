import os

class Config(object):
    POSTGRES_HOSTNAME = os.environ.get('DATABASE_HOST', 'db')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
    POSTGRES_USER = os.environ.get('POSTGRES_USER', 'volumetric')
    POSTGRES_DB = os.environ.get('POSTGRES_DB', POSTGRES_USER)
    POSTGRES_PORT = os.environ.get('DATABASE_PORT', '5432')
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'something')
    AZURE_KEYS_URI = 'https://login.microsoftonline.com/common/discovery/v2.0/keys'
    AZURE_APP_CLIENT_ID = '7366258d-0901-4716-b9aa-4a48c3512f6e'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = "postgresql://{username}:{password}@{hostname}:{port}/{database}" \
        .format(username=POSTGRES_USER, password=POSTGRES_PASSWORD, hostname=POSTGRES_HOSTNAME,
                port=POSTGRES_PORT, database=POSTGRES_DB)

    # Remote debugging
    REMOTE_DEBUG = True

    UPLOAD_FOLDER = 'uploads'
