from flask import jsonify, abort, request
from models import Case as CaseModel
from .marshmallow_schemas import case_schema
from utils.authentication import get_validated_user


def case_endpoint(case_id):
    # TODO: Enable authentication in REST-API
    # user = get_validated_user()
    # request.user = user
    case = CaseModel.query.filter(CaseModel.id == case_id).first()
    result = case_schema.dump(case).data
    if len(result) == 0:
        abort(404)
    return jsonify({'case': result})
