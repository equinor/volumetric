"""initial_db

Revision ID: 948d8e6d3f83
Revises: 
Create Date: 2019-01-10 15:53:34.778442

"""
from alembic import op, context
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '948d8e6d3f83'
down_revision = None
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
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('field', sa.Column('name', sa.String(), nullable=False), sa.PrimaryKeyConstraint('name'))
    op.create_table('tasks', sa.Column('id', sa.String(length=36), nullable=False),
                    sa.Column('user', sa.String(), nullable=True), sa.Column('case_name', sa.String(), nullable=True),
                    sa.Column('queued_at', sa.DateTime(), nullable=True),
                    sa.Column('complete', sa.Boolean(), nullable=True), sa.Column(
                        'failed', sa.Boolean(), nullable=True), sa.Column('message', sa.String(), nullable=True),
                    sa.PrimaryKeyConstraint('id'))
    op.create_table('case', sa.Column('id', sa.Integer(), nullable=False), sa.Column(
        'name', sa.String(), nullable=False), sa.Column('created_user', sa.String(), nullable=False),
                    sa.Column('created_date', sa.DateTime(), nullable=True),
                    sa.Column('case_type', sa.Enum('SEGMENT', 'FULL_FIELD', name='casetypeenum'), nullable=False),
                    sa.Column('case_version', sa.String(), nullable=False),
                    sa.Column('description', sa.String(), nullable=True),
                    sa.Column('is_official', sa.Boolean(), nullable=True),
                    sa.Column('official_from_date', sa.DateTime(), nullable=True),
                    sa.Column('official_to_date', sa.DateTime(), nullable=True),
                    sa.Column('field_name', sa.String(), nullable=False),
                    sa.ForeignKeyConstraint(['field_name'], ['field.name'], onupdate='CASCADE', ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id'))
    op.create_table('location', sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('case_id', sa.Integer(), nullable=False),
                    sa.Column('region_name', sa.String(), nullable=True),
                    sa.Column('zone_name', sa.String(), nullable=True),
                    sa.Column('facies_name', sa.String(), nullable=True),
                    sa.Column('license', sa.String(), nullable=True),
                    sa.ForeignKeyConstraint(['case_id'], ['case.id'], onupdate='CASCADE', ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('case_id', 'region_name', 'zone_name', 'facies_name', 'license'))
    op.create_table('realization', sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('realization', sa.Integer(), server_default='1', nullable=True),
                    sa.Column('iteration', sa.Integer(), server_default='1', nullable=True),
                    sa.Column('location_id', sa.Integer(), nullable=False),
                    sa.ForeignKeyConstraint(['location_id'], ['location.id'], onupdate='CASCADE', ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id'), sa.UniqueConstraint('realization', 'location_id', 'iteration'))
    op.create_table(
        'volumetrics', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('phase', sa.Enum('OIL', 'GAS', 'TOTAL', name='phaseenum'), nullable=True),
        sa.Column('realization_id', sa.Integer(), nullable=False),
        sa.Column('bulk', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('net', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('porv', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('hcpv', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('stoiip', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('giip', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('associatedgas', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('associatedliquid', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.Column('recoverable', sa.Numeric(precision=20, scale=2), nullable=True),
        sa.ForeignKeyConstraint(['realization_id'], ['realization.id'], onupdate='CASCADE', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'), sa.UniqueConstraint('realization_id', 'phase'))
    # ### end Alembic commands ###


def schema_downgrades():
    """schema downgrade migrations go here."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('volumetrics')
    op.drop_table('realization')
    op.drop_table('location')
    op.drop_table('case')
    op.drop_table('tasks')
    op.drop_table('field')
    # ### end Alembic commands ###


def data_upgrades():
    """Add any optional data upgrade migrations here!"""
    pass


def data_downgrades():
    """Add any optional data downgrade migrations here!"""
    pass
