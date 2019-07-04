import hashlib

from flask import request, jsonify, abort
from werkzeug.utils import secure_filename

from services.azure_file_service import AzureFilesService
from utils.authentication import is_user


def file_upload():
    if not is_user(request.user):
        return abort(403)

    file = request.files['file']
    filename = secure_filename(file.filename)
    bytes_file = file.read()
    file_hash = hashlib.sha256(bytes_file).hexdigest()
    AzureFilesService.create_file_from_bytes(bytes_file, file_hash)
    return jsonify({'filename': filename, 'hash': file_hash})
