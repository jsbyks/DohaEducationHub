"""
Tests for Stripe webhook handling and booking status updates.
"""
import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from db import Base, get_db
from models import User, Teacher, Booking
from datetime import date
from auth import hash_password


# Test database setup
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_payments.db"
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(test_db):
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def parent_user(db_session):
    user = User(
        email="payer@test.com",
        hashed_password=hash_password("payer123"),
        full_name="Payer",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def teacher(db_session):
    t = Teacher(user_id=111, full_name="Pay Teacher", hourly_rate_online=50.0, currency="QAR")
    db_session.add(t)
    db_session.commit()
    db_session.refresh(t)
    return t


def test_webhook_payment_succeeds_updates_booking(client, db_session, parent_user, teacher):
    # create booking directly in DB
    booking = Booking(
        teacher_id=teacher.id,
        parent_id=parent_user.id,
        subject="Math",
        session_type="online",
        duration_hours=1,
        scheduled_date=date(2025, 12, 22),
        start_time="09:00",
        end_time="10:00",
        hourly_rate=teacher.hourly_rate_online,
        total_amount=teacher.hourly_rate_online,
        commission_amount=teacher.hourly_rate_online * 0.15,
        teacher_amount=teacher.hourly_rate_online * 0.85,
    )
    db_session.add(booking)
    db_session.commit()
    db_session.refresh(booking)

    # Prepare fake Stripe event payload (without signature)
    event = {
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_test_123",
                "metadata": {"booking_id": str(booking.id)},
                "status": "succeeded",
            }
        }
    }

    resp = client.post("/api/payments/webhook", data=json.dumps(event), headers={"Content-Type": "application/json"})
    assert resp.status_code == 200

    # Reload booking
    b = db_session.query(Booking).filter(Booking.id == booking.id).first()
    assert b.payment_status == 'paid'
    assert b.status == 'confirmed'


def test_webhook_signature_verification(monkeypatch, client, db_session, parent_user, teacher):
    # create booking directly in DB
    booking = Booking(
        teacher_id=teacher.id,
        parent_id=parent_user.id,
        subject="Math",
        session_type="online",
        duration_hours=1,
        scheduled_date=date(2025, 12, 23),
        start_time="09:00",
        end_time="10:00",
        hourly_rate=teacher.hourly_rate_online,
        total_amount=teacher.hourly_rate_online,
        commission_amount=teacher.hourly_rate_online * 0.15,
        teacher_amount=teacher.hourly_rate_online * 0.85,
    )
    db_session.add(booking)
    db_session.commit()
    db_session.refresh(booking)

    # Prepare fake Stripe event payload
    event = {
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_test_sig",
                "metadata": {"booking_id": str(booking.id)},
                "status": "succeeded",
            }
        }
    }

    # Inject fake stripe webhook construct_event that returns our event
    import api.payments as payments_module

    class FakeWebhook:
        @staticmethod
        def construct_event(payload, sig, secret):
            # return a dict like stripe would
            return event

    fake_stripe = type("S", (), {"Webhook": FakeWebhook})

    monkeypatch.setattr(payments_module, "stripe", fake_stripe)
    monkeypatch.setenv("STRIPE_WEBHOOK_SECRET", "whsec_test")

    resp = client.post("/api/payments/webhook", data=json.dumps(event), headers={"Content-Type": "application/json", "stripe-signature": "t=test"})
    assert resp.status_code == 200

    b = db_session.query(Booking).filter(Booking.id == booking.id).first()
    assert b.payment_status == 'paid'
    assert b.status == 'confirmed'
