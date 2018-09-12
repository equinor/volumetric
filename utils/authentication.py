import jwt
from jwt.algorithms import RSAAlgorithm
import requests
import json
from flask import request
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


def jwt_require():
    global public_key
    global public_key_timestamp
    encoded_token = request.headers.get('AUTHORIZATION').split(' ')[1]

    if public_key_timestamp == '' or public_key_timestamp < datetime.datetime.now() - datetime.timedelta(hours=24):
        public_key = get_AzureActiveDirectoryCert(jwt.get_unverified_header(encoded_token))
        public_key_timestamp = datetime.datetime.now()

    return jwt.decode(encoded_token, public_key, algorithms=['RS256'], audience=Config.AZURE_APP_CLIENT_ID)
