"""Create school reviews table

Revision ID: create_school_reviews_table
Revises: add_enhanced_school_fields
Create Date: 2025-12-16

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'create_school_reviews_table'
down_revision = 'add_enhanced_school_fields'
branch_labels = None
depends_on = None


def upgrade():
    # Create school_reviews table
    op.create_table(
        'school_reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('school_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),  # Nullable for anonymous reviews
        sa.Column('reviewer_name', sa.String(200), nullable=True),  # For anonymous/display name
        sa.Column('reviewer_email', sa.String(255), nullable=True),

        # Overall rating
        sa.Column('overall_rating', sa.Integer(), nullable=False),

        # Specific category ratings
        sa.Column('academic_quality_rating', sa.Integer(), nullable=True),
        sa.Column('teaching_staff_rating', sa.Integer(), nullable=True),
        sa.Column('facilities_rating', sa.Integer(), nullable=True),
        sa.Column('communication_rating', sa.Integer(), nullable=True),
        sa.Column('value_for_money_rating', sa.Integer(), nullable=True),
        sa.Column('extracurricular_rating', sa.Integer(), nullable=True),
        sa.Column('administration_rating', sa.Integer(), nullable=True),

        # Review content
        sa.Column('review_title', sa.String(200), nullable=True),
        sa.Column('review_text', sa.Text(), nullable=False),
        sa.Column('pros', sa.Text(), nullable=True),
        sa.Column('cons', sa.Text(), nullable=True),

        # Reviewer details
        sa.Column('reviewer_relationship', sa.String(50), nullable=True),  # Current Parent, Former Parent, etc.
        sa.Column('child_grade_level', sa.String(50), nullable=True),
        sa.Column('years_at_school', sa.Integer(), nullable=True),

        # Verification and moderation
        sa.Column('parent_verified', sa.Boolean(), default=False),
        sa.Column('verification_token', sa.String(100), nullable=True),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(20), default='pending'),  # pending, approved, rejected, flagged
        sa.Column('moderation_notes', sa.Text(), nullable=True),
        sa.Column('moderated_by', sa.Integer(), nullable=True),  # Admin user ID
        sa.Column('moderated_at', sa.DateTime(), nullable=True),

        # Engagement metrics
        sa.Column('helpful_votes', sa.Integer(), default=0),
        sa.Column('unhelpful_votes', sa.Integer(), default=0),
        sa.Column('view_count', sa.Integer(), default=0),

        # School response
        sa.Column('school_response', sa.Text(), nullable=True),
        sa.Column('school_response_date', sa.DateTime(), nullable=True),
        sa.Column('school_responder_name', sa.String(200), nullable=True),
        sa.Column('school_responder_title', sa.String(100), nullable=True),

        # Timestamps
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), onupdate=sa.text('CURRENT_TIMESTAMP')),

        # Primary key and foreign keys
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['school_id'], ['schools.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),

        # Constraints
        sa.CheckConstraint('overall_rating >= 1 AND overall_rating <= 5', name='overall_rating_check'),
        sa.CheckConstraint('academic_quality_rating >= 1 AND academic_quality_rating <= 5 OR academic_quality_rating IS NULL', name='academic_rating_check'),
        sa.CheckConstraint('teaching_staff_rating >= 1 AND teaching_staff_rating <= 5 OR teaching_staff_rating IS NULL', name='teaching_rating_check'),
        sa.CheckConstraint('facilities_rating >= 1 AND facilities_rating <= 5 OR facilities_rating IS NULL', name='facilities_rating_check'),
        sa.CheckConstraint('communication_rating >= 1 AND communication_rating <= 5 OR communication_rating IS NULL', name='communication_rating_check'),
        sa.CheckConstraint('value_for_money_rating >= 1 AND value_for_money_rating <= 5 OR value_for_money_rating IS NULL', name='value_rating_check'),
        sa.CheckConstraint('extracurricular_rating >= 1 AND extracurricular_rating <= 5 OR extracurricular_rating IS NULL', name='extracurricular_rating_check'),
        sa.CheckConstraint('administration_rating >= 1 AND administration_rating <= 5 OR administration_rating IS NULL', name='administration_rating_check'),
    )

    # Create indexes
    op.create_index('idx_school_reviews_school_id', 'school_reviews', ['school_id'])
    op.create_index('idx_school_reviews_user_id', 'school_reviews', ['user_id'])
    op.create_index('idx_school_reviews_status', 'school_reviews', ['status'])
    op.create_index('idx_school_reviews_overall_rating', 'school_reviews', ['overall_rating'])
    op.create_index('idx_school_reviews_created_at', 'school_reviews', ['created_at'])
    op.create_index('idx_school_reviews_helpful_votes', 'school_reviews', ['helpful_votes'])

    # Create table for tracking helpful votes
    op.create_table(
        'review_helpful_votes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('review_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),  # Support IPv6
        sa.Column('is_helpful', sa.Boolean(), nullable=False),  # True = helpful, False = unhelpful
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),

        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['review_id'], ['school_reviews.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('review_id', 'user_id', name='unique_user_vote'),  # One vote per user per review
        sa.UniqueConstraint('review_id', 'ip_address', name='unique_ip_vote')  # One vote per IP per review
    )

    op.create_index('idx_review_votes_review_id', 'review_helpful_votes', ['review_id'])


def downgrade():
    # Drop tables
    op.drop_table('review_helpful_votes')
    op.drop_table('school_reviews')
