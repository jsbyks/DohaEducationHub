"""
Integration tests for bookings and availability logic.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from db import Base, get_db
from models import User, Teacher, TeacherAvailability
from auth import hash_password


# Test database setup
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_bookings.db"
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
        email="parent@test.com",
        hashed_password=hash_password("parent123"),
        full_name="Parent User",
        is_active=True,
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def teacher(db_session):
    t = Teacher(
        user_id=9999,  # synthetic user link
        full_name="Test Teacher",
        teaches_online=True,
        teaches_in_person=True,
        hourly_rate_online=50.0,
        hourly_rate_qatari=60.0,
        currency="QAR",
    )
    db_session.add(t)
    db_session.commit()
    db_session.refresh(t)

    # Add availability: 09:00-12:00 recurring (day_of_week arbitrary for test)
    avail = TeacherAvailability(teacher_id=t.id, day_of_week=0, start_time="09:00", end_time="12:00", is_recurring=True)
    db_session.add(avail)
    db_session.commit()
    return t


def login_and_get_token(client, email, password):
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_create_booking_success(client, db_session, parent_user, teacher):
    # Register and login parent
    client.post("/api/auth/register", json={"email": "parent@test.com", "password": "parent123", "full_name": "Parent"})
    token = login_and_get_token(client, "parent@test.com", "parent123")

    booking_payload = {
        "teacher_id": teacher.id,
        "subject": "Mathematics",
        "session_type": "online",
        "duration_hours": 1,
        "scheduled_date": "2025-12-22",
        "start_time": "09:30",
    }

    resp = client.post("/api/bookings/", json=booking_payload, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["teacher_id"] == teacher.id
    assert data["total_amount"] == teacher.hourly_rate_online * booking_payload["duration_hours"]


def test_create_booking_conflict(client, db_session, parent_user, teacher):
    # Register and login parent
    client.post("/api/auth/register", json={"email": "parent@test.com", "password": "parent123", "full_name": "Parent"})
    token = login_and_get_token(client, "parent@test.com", "parent123")

    booking_payload = {
        "teacher_id": teacher.id,
        "subject": "Science",
        "session_type": "online",
        "duration_hours": 1,
        "scheduled_date": "2025-12-22",
        "start_time": "10:00",
    }

    resp = client.post("/api/bookings/", json=booking_payload, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 201

    # Attempt overlapping booking 10:30-11:30 (should be rejected)
    conflict_payload = {
        **booking_payload,
        "start_time": "10:30",
    }

    resp2 = client.post("/api/bookings/", json=conflict_payload, headers={"Authorization": f"Bearer {token}"})
    assert resp2.status_code == 400
    assert "not available" in resp2.json()["detail"].lower()
