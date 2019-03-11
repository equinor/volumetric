import datetime
import json

import jwt
import requests
from flask import request, abort
from jwt.algorithms import RSAAlgorithm

from config import Config


class AzureCert(object):
    timestamp = ''
    cert = ''


def get_azure_active_directory_cert():
    try:
        azure_keys = requests.get(Config.AZURE_KEYS_URI).json()
    except requests.RequestException as error:
        abort(500, error)
    return azure_keys['keys']


def select_cert_from_token_key(azure_keys, token_header):
    for key in azure_keys:
        if key['kid'] == token_header['kid']:
            key_json = json.dumps(key)
            return RSAAlgorithm.from_jwk(key_json)


class User(object):
    name = None
    shortname = None
    isCreator = False
    isAdmin = False

    def __init__(self, name=None, shortname=None, roles=None):
        self.name = name
        self.shortname = shortname
        if roles is not None:
            self.isCreator = 'VolumetricAdmin' in roles or 'VolumetricCreator' in roles
            self.isAdmin = 'VolumetricAdmin' in roles


def get_validated_user():
    auth_header = request.headers.get('AUTHORIZATION')
    if not auth_header:
        raise AttributeError('Missing authentication header in request')
    token = auth_header.split(' ')[1]

    if AzureCert.timestamp == '' \
            or AzureCert.timestamp < datetime.datetime.now() - datetime.timedelta(hours=24):
        AzureCert.cert = get_azure_active_directory_cert()
        AzureCert.timestamp = datetime.datetime.now()

    public_key = select_cert_from_token_key(AzureCert.cert, jwt.get_unverified_header(token))
    decoded = jwt.decode(token, public_key, algorithms=['RS256'], audience=Config.AZURE_APP_CLIENT_ID)
    shortname = decoded.get('unique_name').split('@')[0].lower()

    return User(name=decoded.get('name'), shortname=shortname, roles=decoded.get('roles'))
