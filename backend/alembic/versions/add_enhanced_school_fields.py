"""Add enhanced school fields

Revision ID: add_enhanced_school_fields
Revises: 972641930c9c
Create Date: 2025-12-16

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, ARRAY

# revision identifiers, used by Alembic.
revision = 'add_enhanced_school_fields'
down_revision = '972641930c9c'
branch_labels = None
depends_on = None


def upgrade():
    # Add academic information fields
    op.add_column('schools', sa.Column('language_of_instruction', ARRAY(sa.String), nullable=True))
    op.add_column('schools', sa.Column('grade_levels_offered', JSONB, nullable=True))
    op.add_column('schools', sa.Column('ministry_approval_status', sa.String(100), nullable=True))
    op.add_column('schools', sa.Column('accreditation_bodies', ARRAY(sa.String), nullable=True))
    op.add_column('schools', sa.Column('religious_affiliation', sa.String(100), nullable=True))
    op.add_column('schools', sa.Column('academic_calendar', JSONB, nullable=True))

    # Add financial details fields
    op.add_column('schools', sa.Column('tuition_fees_by_grade', JSONB, nullable=True))
    op.add_column('schools', sa.Column('registration_fee', sa.Numeric(10, 2), nullable=True))
    op.add_column('schools', sa.Column('registration_fee_refundable', sa.Boolean, default=False))
    op.add_column('schools', sa.Column('deposit_required', sa.Numeric(10, 2), nullable=True))
    op.add_column('schools', sa.Column('deposit_refundable', sa.Boolean, default=True))
    op.add_column('schools', sa.Column('additional_costs', JSONB, nullable=True))
    op.add_column('schools', sa.Column('payment_terms', ARRAY(sa.String), nullable=True))
    op.add_column('schools', sa.Column('accepts_educational_voucher', sa.Boolean, default=False))
    op.add_column('schools', sa.Column('educational_voucher_amount', sa.Numeric(10, 2), nullable=True))
    op.add_column('schools', sa.Column('corporate_discounts_available', sa.Boolean, default=False))
    op.add_column('schools', sa.Column('sibling_discount_percentage', sa.Integer, nullable=True))

    # Add facilities and programs fields
    op.add_column('schools', sa.Column('facilities', JSONB, nullable=True))
    op.add_column('schools', sa.Column('technology_integration', JSONB, nullable=True))
    op.add_column('schools', sa.Column('extracurricular_activities', ARRAY(sa.String), nullable=True))
    op.add_column('schools', sa.Column('afterschool_care', sa.Boolean, default=False))
    op.add_column('schools', sa.Column('afterschool_care_fee', sa.Numeric(10, 2), nullable=True))
    op.add_column('schools', sa.Column('afterschool_care_timings', sa.String(100), nullable=True))

    # Add special programs fields
    op.add_column('schools', sa.Column('sen_support', sa.Boolean, default=False))
    op.add_column('schools', sa.Column('sen_programs', JSONB, nullable=True))
    op.add_column('schools', sa.Column('gifted_programs', sa.Boolean, default=False))
    op.add_column('schools', sa.Column('counseling_services', sa.Boolean, default=False))

    # Add transportation fields
    op.add_column('schools', sa.Column('bus_service_available', sa.Boolean, default=False))
    op.add_column('schools', sa.Column('transportation_fee', sa.Numeric(10, 2), nullable=True))
    op.add_column('schools', sa.Column('transportation_fee_period', sa.String(50), nullable=True))
    op.add_column('schools', sa.Column('bus_routes', ARRAY(sa.String), nullable=True))
    op.add_column('schools', sa.Column('transportation_safety_features', ARRAY(sa.String), nullable=True))

    # Add admission process fields
    op.add_column('schools', sa.Column('entry_requirements', sa.Text, nullable=True))
    op.add_column('schools', sa.Column('application_deadline', sa.Date, nullable=True))
    op.add_column('schools', sa.Column('assessment_procedures', sa.Text, nullable=True))
    op.add_column('schools', sa.Column('required_documents', ARRAY(sa.String), nullable=True))
    op.add_column('schools', sa.Column('age_requirements', JSONB, nullable=True))
    op.add_column('schools', sa.Column('enrollment_steps', ARRAY(sa.String), nullable=True))

    # Add performance metrics fields
    op.add_column('schools', sa.Column('student_teacher_ratio', sa.String(20), nullable=True))
    op.add_column('schools', sa.Column('average_class_size', sa.Integer, nullable=True))
    op.add_column('schools', sa.Column('ministry_inspection_rating', sa.String(50), nullable=True))
    op.add_column('schools', sa.Column('last_inspection_date', sa.Date, nullable=True))
    op.add_column('schools', sa.Column('academic_achievements', ARRAY(sa.String), nullable=True))

    # Add operational fields
    op.add_column('schools', sa.Column('school_timings', sa.String(100), nullable=True))
    op.add_column('schools', sa.Column('kahramaa_number', sa.String(50), nullable=True))
    op.add_column('schools', sa.Column('established_year', sa.Integer, nullable=True))
    op.add_column('schools', sa.Column('total_students', sa.Integer, nullable=True))
    op.add_column('schools', sa.Column('total_staff', sa.Integer, nullable=True))

    # Add status fields
    op.add_column('schools', sa.Column('accepting_new_students', sa.Boolean, default=True))
    op.add_column('schools', sa.Column('has_waiting_list', sa.Boolean, default=False))
    op.add_column('schools', sa.Column('application_status', sa.String(50), nullable=True))

    # Add media fields
    op.add_column('schools', sa.Column('logo_url', sa.String(500), nullable=True))
    op.add_column('schools', sa.Column('featured_image', sa.String(500), nullable=True))
    op.add_column('schools', sa.Column('gallery', JSONB, nullable=True))
    op.add_column('schools', sa.Column('principals_message', sa.Text, nullable=True))
    op.add_column('schools', sa.Column('virtual_tour_url', sa.String(500), nullable=True))

    # Add social media fields
    op.add_column('schools', sa.Column('social_media', JSONB, nullable=True))


def downgrade():
    # Remove all added columns
    op.drop_column('schools', 'social_media')
    op.drop_column('schools', 'virtual_tour_url')
    op.drop_column('schools', 'principals_message')
    op.drop_column('schools', 'gallery')
    op.drop_column('schools', 'featured_image')
    op.drop_column('schools', 'logo_url')
    op.drop_column('schools', 'application_status')
    op.drop_column('schools', 'has_waiting_list')
    op.drop_column('schools', 'accepting_new_students')
    op.drop_column('schools', 'total_staff')
    op.drop_column('schools', 'total_students')
    op.drop_column('schools', 'established_year')
    op.drop_column('schools', 'kahramaa_number')
    op.drop_column('schools', 'school_timings')
    op.drop_column('schools', 'academic_achievements')
    op.drop_column('schools', 'last_inspection_date')
    op.drop_column('schools', 'ministry_inspection_rating')
    op.drop_column('schools', 'average_class_size')
    op.drop_column('schools', 'student_teacher_ratio')
    op.drop_column('schools', 'enrollment_steps')
    op.drop_column('schools', 'age_requirements')
    op.drop_column('schools', 'required_documents')
    op.drop_column('schools', 'assessment_procedures')
    op.drop_column('schools', 'application_deadline')
    op.drop_column('schools', 'entry_requirements')
    op.drop_column('schools', 'transportation_safety_features')
    op.drop_column('schools', 'bus_routes')
    op.drop_column('schools', 'transportation_fee_period')
    op.drop_column('schools', 'transportation_fee')
    op.drop_column('schools', 'bus_service_available')
    op.drop_column('schools', 'counseling_services')
    op.drop_column('schools', 'gifted_programs')
    op.drop_column('schools', 'sen_programs')
    op.drop_column('schools', 'sen_support')
    op.drop_column('schools', 'afterschool_care_timings')
    op.drop_column('schools', 'afterschool_care_fee')
    op.drop_column('schools', 'afterschool_care')
    op.drop_column('schools', 'extracurricular_activities')
    op.drop_column('schools', 'technology_integration')
    op.drop_column('schools', 'facilities')
    op.drop_column('schools', 'sibling_discount_percentage')
    op.drop_column('schools', 'corporate_discounts_available')
    op.drop_column('schools', 'educational_voucher_amount')
    op.drop_column('schools', 'accepts_educational_voucher')
    op.drop_column('schools', 'payment_terms')
    op.drop_column('schools', 'additional_costs')
    op.drop_column('schools', 'deposit_refundable')
    op.drop_column('schools', 'deposit_required')
    op.drop_column('schools', 'registration_fee_refundable')
    op.drop_column('schools', 'registration_fee')
    op.drop_column('schools', 'tuition_fees_by_grade')
    op.drop_column('schools', 'academic_calendar')
    op.drop_column('schools', 'religious_affiliation')
    op.drop_column('schools', 'accreditation_bodies')
    op.drop_column('schools', 'ministry_approval_status')
    op.drop_column('schools', 'grade_levels_offered')
    op.drop_column('schools', 'language_of_instruction')
