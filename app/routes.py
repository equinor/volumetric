#from app.models import *
from app import app
from app.models.user import User
from flask import jsonify

@app.route('/')
@app.route('/index')
def index():
    return jsonify({'AAAAdre': User.query.all()})


@app.route('/create')
def create():
    User.insert(name='stig')
    return jsonify({'AAAAdre': User.query.all()})