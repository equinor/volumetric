import os


class Config(object):
    POSTGRES_HOSTNAME = os.environ.get('DATABASE_HOST', 'db')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'volumetric')
    POSTGRES_USER = os.environ.get('POSTGRES_USER', 'volumetric')
    POSTGRES_DB = os.environ.get('POSTGRES_DB', POSTGRES_USER)
    POSTGRES_PORT = os.environ.get('DATABASE_PORT', '5432')
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'volumetric')
    AZURE_KEYS_URI = os.environ.get('AZURE_KEYS_URI', 'https://login.microsoftonline.com/common/discovery/v2.0/keys')
    AZURE_APP_CLIENT_ID = os.environ.get('AZURE_APP_CLIENT_ID', 'c049f236-7e38-41ba-be77-287bc1c8543c')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = (f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}'
                               f'@{POSTGRES_HOSTNAME}:{POSTGRES_PORT}/{POSTGRES_DB}')
    REDIS_URL = 'redis'
    REDIS_PORT = 6379
    JSON_SORT_KEYS = False
    UPLOAD_FOLDER = 'uploads'
    # Remote debugging
    REMOTE_DEBUG = False
