import os

from flask_sqlalchemy import SQLAlchemy


class BatchSQLAlchemy(SQLAlchemy):
    def apply_driver_hacks(self, app, info, options):
        if os.environ.get('ENVIRONMENT') != 'test':
            options.update({
                'use_batch_mode': True,
            })
        super(BatchSQLAlchemy, self).apply_driver_hacks(app, info, options)


db = BatchSQLAlchemy()
from models.field import Field
from models.model import Model
from models.location import Location
from models.volumetrics import Volumetrics
