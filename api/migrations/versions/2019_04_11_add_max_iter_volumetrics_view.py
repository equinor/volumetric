"""add_max_iter_volumetrics_view

Revision ID: 06f7946ad1e7
Revises: 948d8e6d3f83
Create Date: 2019-04-11 10:28:08.696356

"""
from alembic import op, context
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '06f7946ad1e7'
down_revision = '948d8e6d3f83'
branch_labels = None
depends_on = None


def upgrade():
    schema_upgrades()
    if context.get_x_argument(as_dictionary=True).get('data') == 'true':
        data_upgrades()


def downgrade():
    if context.get_x_argument(as_dictionary=True).get('data') == 'true':
        data_downgrades()
    schema_downgrades()


def schema_upgrades():
    """schema upgrade migrations go here."""
    op.execute(f'''
    CREATE MATERIALIZED VIEW max_iter_volumetrics AS
    SELECT phase,
           r.id                    as realization_id,
           r.realization,
           max_iter_table.max_iter as max_iteration,
           r.location_id           as location_id,
           r.iteration,
           bulk,
           net,
           porv,
           hcpv,
           stoiip,
           giip,
           associatedgas,
           associatedliquid,
           recoverable
    FROM volumetrics
           LEFT JOIN realization r on volumetrics.realization_id = r.id
           INNER JOIN (
      SELECT location_id, realization.realization, MAX(iteration) AS max_iter
      FROM realization
      GROUP BY location_id, realization.realization
    ) AS max_iter_table
                      ON max_iter_table.location_id = r.location_id AND max_iter_table.realization = r.realization;
    ''')


def schema_downgrades():
    """schema downgrade migrations go here."""
    op.execute(f'DROP MATERIALIZED VIEW max_iter_volumetrics;')


def data_upgrades():
    """Add any optional data upgrade migrations here!"""
    pass


def data_downgrades():
    """Add any optional data downgrade migrations here!"""
    pass
