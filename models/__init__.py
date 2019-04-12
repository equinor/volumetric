import os

from flask_sqlalchemy import SQLAlchemy


class BatchSQLAlchemy(SQLAlchemy):
    def apply_driver_hacks(self, app, info, options):
        options.update({
            'use_batch_mode': True,
        })
        super(BatchSQLAlchemy, self).apply_driver_hacks(app, info, options)


db = BatchSQLAlchemy()
from models.field import Field
from models.case import Case
from models.location import Location
from models.realization import Realization
from models.volumetrics import Volumetrics, PhaseEnum, PhaseEnumGraphene, MaxIterVolumetrics
from models.tasks import Task
from models.case import CaseTypeEnum
