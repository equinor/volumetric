from flask import jsonify, abort

from models import Case as CaseModel
from .marshmallow_schemas import case_schema


def case_endpoint(case_id):
    case = CaseModel.query.filter(CaseModel.id == case_id).first()
    result = case_schema.dump(case).data
    if len(result) == 0:
        abort(404)
    return jsonify({'case': result})
