"""
Admin endpoints tests for teacher management.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from db import Base, get_db
from models import User, Teacher
from auth import hash_password


# Test DB setup
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_admin.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
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
def admin_user(db_session):
    user = User(email="admin@test.com", hashed_password=hash_password("admin123"), full_name="Admin", is_admin=True)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def teacher(db_session):
    t = Teacher(user_id=222, full_name="Admin Teacher", is_verified=False, is_featured=False)
    db_session.add(t)
    db_session.commit()
    db_session.refresh(t)
    return t


def get_token(client, email, password):
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_admin_list_and_update(client, db_session, admin_user, teacher):
    # Register admin user and get token
    client.post("/api/auth/register", json={"email": "admin@test.com", "password": "admin123", "full_name": "Admin"})
    token = get_token(client, "admin@test.com", "admin123")

    # List all teachers
    resp = client.get("/api/teachers/all", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert any(t["id"] == teacher.id for t in data)

    # Update verification
    resp2 = client.put(f"/api/teachers/{teacher.id}/verification", params={"is_verified": True}, headers={"Authorization": f"Bearer {token}"})
    assert resp2.status_code == 200
    assert resp2.json()["is_verified"] is True

    # Toggle featured
    resp3 = client.put(f"/api/teachers/{teacher.id}/featured", params={"is_featured": True}, headers={"Authorization": f"Bearer {token}"})
    assert resp3.status_code == 200
    assert resp3.json()["is_featured"] is True
