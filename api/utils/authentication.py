import datetime
import json

import jwt
import requests
from flask import request, abort
from jwt.algorithms import RSAAlgorithm

from config import Config
from models import db
from models.role import Role
from models.user import User as UserModel
from utils.db import get_or_create


class AzureCert(object):
    timestamp = ''
    cert = ''


def is_user(user):
    if user.isAdmin:
        return True
    elif len(user.roles) > 0:
        return True


def is_reader(user, field):
    if user.isAdmin:
        return True
    elif user.roles.get(field) in ('reader', 'creator', 'fieldadmin'):
        return True


def is_creator(user, field):
    if user.isAdmin:
        return True
    elif user.roles.get(field) in ('creator', 'fieldadmin'):
        return True


def is_fieldadmin(user, field):
    if user.isAdmin:
        return True
    elif user.roles.get(field) in ('fieldadmin'):
        return True


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
    roles = None
    isAdmin = False

    def __init__(self, name=None, shortname=None, roles=None):
        self.name = name
        self.shortname = shortname
        get_or_create(db.session, UserModel, defaults=None, shortname=shortname)
        field_roles = [role.__dict__ for role in Role.query.filter(Role.user == shortname).all()]
        role_dict = {field['field']: field['role'] for field in field_roles}
        self.roles = role_dict
        if roles is not None:
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
