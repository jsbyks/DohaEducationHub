"""
Integration tests for authentication endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from db import Base, get_db
from models import User
from auth import hash_password

# Test database setup
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(test_db):
    """Get a database session for testing."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    """Get a test client with database dependency override."""
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
def test_user(db_session):
    """Create a test user in the database."""
    user = User(
        email="testuser@example.com",
        hashed_password=hash_password("testpass123"),
        full_name="Test User",
        is_active=True,
        is_admin=False
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def test_register_new_user(client):
    """Test user registration with valid data."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "securepass123",
            "full_name": "New User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New User"
    assert data["is_active"] is True
    assert data["is_admin"] is False
    assert "id" in data


def test_register_duplicate_email(client, test_user):
    """Test that registering with an existing email fails."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "testuser@example.com",  # Already exists
            "password": "password123",
            "full_name": "Duplicate User"
        }
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_login_valid_credentials(client, test_user):
    """Test login with valid credentials."""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "testuser@example.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client, test_user):
    """Test login with incorrect password."""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "testuser@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()


def test_login_nonexistent_user(client):
    """Test login with non-existent user."""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 401


def test_get_current_user(client, test_user):
    """Test getting current user info with valid token."""
    # First, login to get token
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "testuser@example.com",
            "password": "testpass123"
        }
    )
    token = login_response.json()["access_token"]

    # Use token to get user info
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert data["full_name"] == "Test User"


def test_get_current_user_invalid_token(client):
    """Test getting current user with invalid token."""
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401


def test_get_current_user_no_token(client):
    """Test getting current user without token."""
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_refresh_token(client, test_user):
    """Test refreshing access token with valid refresh token."""
    # Login to get tokens
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "testuser@example.com",
            "password": "testpass123"
        }
    )
    refresh_token = login_response.json()["refresh_token"]

    # Use refresh token to get new tokens
    response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": refresh_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_refresh_token_invalid(client):
    """Test refreshing with invalid refresh token."""
    response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": "invalid_refresh_token"}
    )
    assert response.status_code == 401


def test_logout(client):
    """Test logout endpoint."""
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert "logged out" in response.json()["message"].lower()
