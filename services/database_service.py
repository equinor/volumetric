from sqlalchemy import func, and_
from sqlalchemy.orm import joinedload

from models import db, Location, Volumetrics, Realization


class DatabaseService:
    @staticmethod
    def get_volumetrics(case_id, location_filters):
        filter_queries = [getattr(Location, key[:-1]).in_(value) for key, value in location_filters.items()]
        location_query = db.session.query(Location.id).filter(Location.case_id == case_id)
        for filter_query in filter_queries:
            location_query = location_query.filter(filter_query)
        location_ids = location_query.all()
        if not location_ids:
            return []

        realization_max_iteration_query = db.session.query(Realization.realization, Realization.location_id,
                                                           func.max(Realization.iteration).label('max_iter')).group_by(
                                                               Realization.realization,
                                                               Realization.location_id).subquery()

        realization_query = db.session.query(Realization.id).join(
            realization_max_iteration_query,
            and_(
                Realization.realization == realization_max_iteration_query.c.realization,
                Realization.location_id == realization_max_iteration_query.c.location_id,
                Realization.iteration == realization_max_iteration_query.c.max_iter,
            )).filter(Realization.location_id.in_([location.id for location in location_ids])).subquery()

        return (Volumetrics.query.filter(Volumetrics.realization_id.in_(realization_query)).options(
            joinedload(Volumetrics.realization)).all())
