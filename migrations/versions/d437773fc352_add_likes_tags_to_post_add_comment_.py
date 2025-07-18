"""Add likes, tags to Post; add Comment model; add job_title, company, social_links to Profile

Revision ID: d437773fc352
Revises: a679c43f2135
Create Date: 2025-07-08 15:56:04.831434

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd437773fc352'
down_revision = 'a679c43f2135'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.add_column(sa.Column('likes', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('tags', sa.String(length=255), nullable=True))

    with op.batch_alter_table('profile', schema=None) as batch_op:
        batch_op.add_column(sa.Column('job_title', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('company', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('social_links', sa.Text(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('profile', schema=None) as batch_op:
        batch_op.drop_column('social_links')
        batch_op.drop_column('company')
        batch_op.drop_column('job_title')

    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.drop_column('tags')
        batch_op.drop_column('likes')

    # ### end Alembic commands ###
