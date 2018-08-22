import os
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename


def file_upload():
    target = os.path.join(current_app.instance_path, current_app.config.get('UPLOAD_FOLDER'))
    if not os.path.isdir(target):
        os.mkdir(target)

    file = request.files['file']
    filename = secure_filename(file.filename)
    destination = os.path.join(target, filename)
    file.save(destination)
    return jsonify({'filename': filename})
