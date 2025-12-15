import json
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from main import app
from db import Base, get_db
from models import Booking


# Test database setup (in-memory sqlite)
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def test_db():
    # Create schema for in-memory DB
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


@pytest.fixture(autouse=True)
def enable_test_endpoints(monkeypatch):
    monkeypatch.setenv("ENABLE_TEST_ENDPOINTS", "1")


def test_create_teacher_and_simulate_payment(client, db_session):
    # Create teacher via test endpoint
    resp = client.post("/api/test/create-teacher", json={"full_name": "Sim Teacher", "bio": "Test"})
    assert resp.status_code == 200
    teacher_id = resp.json()["id"]

    # create booking directly in DB
    booking = Booking(
        teacher_id=teacher_id,
        parent_id=12345,
        subject="Science",
        session_type="online",
        duration_hours=1,
        scheduled_date=date(2025, 12, 24),
        start_time="11:00",
        end_time="12:00",
        hourly_rate=40.0,
        total_amount=40.0,
        commission_amount=6.0,
        teacher_amount=34.0,
    )
    db_session.add(booking)
    db_session.commit()
    db_session.refresh(booking)

    # verify route exists in openapi
    openapi = client.get('/openapi.json').json()
    assert '/api/test/create-teacher' in openapi['paths']
    assert '/api/test/simulate-payment-event' in openapi['paths']

    # Simulate payment event
    resp2 = client.post("/api/test/simulate-payment-event", json={"booking_id": booking.id, "event_type": "payment_intent.succeeded"})
    assert resp2.status_code == 200, f"simulate endpoint returned {resp2.status_code}: {resp2.text}"
    data = resp2.json()
    assert data["booking_id"] == booking.id
    assert data["status"] == "confirmed"
    assert data["payment_status"] == "paid"
