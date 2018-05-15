from sqlalchemy.sql import ClauseElement


def get_or_create(session, model, defaults=None, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    else:
        params = {key: value for key, value in kwargs.items() if not isinstance(value, ClauseElement)}
        params.update(defaults or {})
        instance = model(**params)
        session.add(instance)
        return instance, True
