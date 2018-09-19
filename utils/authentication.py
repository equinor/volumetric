import jwt
from jwt.algorithms import RSAAlgorithm
import requests
import json
from flask import request, abort
from config import Config
import datetime

public_key_timestamp = ''
public_key = ''


def get_AzureActiveDirectoryCert(token_header):
    azure_keys = requests.get(Config.AZURE_KEYS_URI).json()
    for key in azure_keys['keys']:
        if key['kid'] == token_header['kid']:
            key_json = json.dumps(key)
            return RSAAlgorithm.from_jwk(key_json)
    return "No Public key found that matches the given Key-ID"


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
    global public_key
    global public_key_timestamp
    token = request.headers.get('AUTHORIZATION')
    if not token:
        return abort(403)
    encoded_token = token.split(' ')[1]

    should_fetch_certs = public_key_timestamp == '' or public_key_timestamp < datetime.datetime.now(
    ) - datetime.timedelta(hours=24)
    if should_fetch_certs:
        public_key = get_AzureActiveDirectoryCert(jwt.get_unverified_header(encoded_token))
        public_key_timestamp = datetime.datetime.now()

    decode = jwt.decode(encoded_token, public_key, algorithms=['RS256'], audience=Config.AZURE_APP_CLIENT_ID)
    shortname = decode.get('unique_name').split('@')[0].lower()
    return User(name=decode.get('name'), shortname=shortname, roles=decode.get('roles'))
