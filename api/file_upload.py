import os

from flask import request, jsonify, current_app, abort
from werkzeug.utils import secure_filename

from utils.authentication import is_user


def file_upload():
    if not is_user(request.user):
        return abort(403)

    target = os.path.join(current_app.instance_path, current_app.config.get('UPLOAD_FOLDER'))
    if not os.path.isdir(target):
        os.mkdir(target)

    file = request.files['file']
    filename = secure_filename(file.filename)
    destination = os.path.join(target, filename)
    file.save(destination)
    return jsonify({'filename': filename})
