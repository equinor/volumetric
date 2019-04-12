from sqlalchemy import func

from models import db, Location, MaxIterVolumetrics


class DatabaseService:
    @staticmethod
    def get_summed_volumetrics(case_id, location_filters, phase):
        filter_queries = [getattr(Location, key[:-1]).in_(value) for key, value in location_filters.items()]

        volumetrics_query = db.session.query(
            Location.case_id,
            MaxIterVolumetrics.phase,
            MaxIterVolumetrics.realization,
            func.sum(MaxIterVolumetrics.bulk).label('bulk'),
            func.sum(MaxIterVolumetrics.net).label('net'),
            func.sum(MaxIterVolumetrics.porv).label('porv'),
            func.sum(MaxIterVolumetrics.hcpv).label('hcpv'),
            func.sum(MaxIterVolumetrics.stoiip).label('stoiip'),
            func.sum(MaxIterVolumetrics.giip).label('giip'),
            func.sum(MaxIterVolumetrics.associatedgas).label('associatedgas'),
            func.sum(MaxIterVolumetrics.associatedliquid).label('associatedliquid'),
            func.sum(MaxIterVolumetrics.recoverable).label('recoverable'),
        ).join(
            MaxIterVolumetrics.location).filter(Location.case_id == case_id).filter(MaxIterVolumetrics.phase == phase)

        for filter_query in filter_queries:
            volumetrics_query = volumetrics_query.filter(filter_query)

        volumetrics_query = volumetrics_query.group_by(Location.case_id, MaxIterVolumetrics.phase,
                                                       MaxIterVolumetrics.realization)

        return volumetrics_query.all()
