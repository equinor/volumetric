from rest_api.cases import case_endpoint


def create_rest_api(app):
    app.add_url_rule('/case/<case_id>', methods=['GET'], view_func=case_endpoint)
    return app
