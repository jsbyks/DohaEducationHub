"""
Integration tests for schools API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from db import Base, get_db
from models import User, School
from auth import hash_password

# Test database setup
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_schools.db"
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
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
def admin_user(db_session):
    """Create an admin user."""
    user = User(
        email="admin@test.com",
        hashed_password=hash_password("admin123"),
        full_name="Admin User",
        is_active=True,
        is_admin=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def regular_user(db_session):
    """Create a regular (non-admin) user."""
    user = User(
        email="user@test.com",
        hashed_password=hash_password("user123"),
        full_name="Regular User",
        is_active=True,
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def admin_token(client, admin_user):
    """Get admin authentication token."""
    response = client.post(
        "/api/auth/login", json={"email": "admin@test.com", "password": "admin123"}
    )
    return response.json()["access_token"]


@pytest.fixture
def user_token(client, regular_user):
    """Get regular user authentication token."""
    response = client.post(
        "/api/auth/login", json={"email": "user@test.com", "password": "user123"}
    )
    return response.json()["access_token"]


@pytest.fixture
def sample_schools(db_session):
    """Create sample schools for testing."""
    schools = [
        School(
            name="British International School",
            type="All-through",
            curriculum="British",
            address="Doha, Qatar",
            status="published",
        ),
        School(
            name="American School of Doha",
            type="All-through",
            curriculum="American",
            address="Al Rayyan, Qatar",
            status="published",
        ),
        School(
            name="Doha College",
            type="Secondary",
            curriculum="British",
            address="West Bay, Doha",
            status="published",
        ),
        School(
            name="International School Qatar",
            type="Primary",
            curriculum="IB",
            address="Doha, Qatar",
            status="pending",
        ),
    ]
    for school in schools:
        db_session.add(school)
    db_session.commit()
    return schools


# ===== List Schools Tests =====


def test_list_schools_default(client, sample_schools):
    """Test listing schools with default parameters."""
    response = client.get("/api/schools/")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "results" in data
    # Should return only published schools by default
    assert data["total"] == 3
    assert len(data["results"]) == 3


def test_list_schools_with_pagination(client, sample_schools):
    """Test pagination."""
    response = client.get("/api/schools/?page=1&page_size=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert data["page"] == 1
    assert data["page_size"] == 2
    assert len(data["results"]) == 2


def test_list_schools_filter_by_curriculum(client, sample_schools):
    """Test filtering by curriculum."""
    response = client.get("/api/schools/?curriculum=British")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert all("British" in school["curriculum"] for school in data["results"])


def test_list_schools_filter_by_type(client, sample_schools):
    """Test filtering by school type."""
    response = client.get("/api/schools/?type=Secondary")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["results"][0]["type"] == "Secondary"


def test_list_schools_search_by_name(client, sample_schools):
    """Test searching by school name."""
    response = client.get("/api/schools/?search=British")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert "British" in data["results"][0]["name"]


def test_list_schools_search_by_location(client, sample_schools):
    """Test searching by location."""
    response = client.get("/api/schools/?location=Rayyan")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert "Rayyan" in data["results"][0]["address"]


def test_list_schools_combined_filters(client, sample_schools):
    """Test combining multiple filters."""
    response = client.get("/api/schools/?curriculum=British&location=Doha")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


# ===== Get Single School Tests =====


def test_get_school_success(client, sample_schools):
    """Test getting a single school by ID."""
    school_id = sample_schools[0].id
    response = client.get(f"/api/schools/{school_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == school_id
    assert data["name"] == sample_schools[0].name


def test_get_school_not_found(client):
    """Test getting a non-existent school."""
    response = client.get("/api/schools/99999")
    assert response.status_code == 404


# ===== Create School Tests (Admin Only) =====


def test_create_school_as_admin(client, admin_token):
    """Test creating a school as admin."""
    school_data = {
        "name": "New Test School",
        "curriculum": "French",
        "type": "Primary",
        "address": "Test Location, Qatar",
        "status": "published",
    }
    response = client.post(
        "/api/schools/",
        json=school_data,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Test School"
    assert data["curriculum"] == "French"
    assert "id" in data


def test_create_school_as_regular_user(client, user_token):
    """Test that regular users cannot create schools."""
    school_data = {"name": "Unauthorized School", "curriculum": "Test", "type": "Test"}
    response = client.post(
        "/api/schools/",
        json=school_data,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 403


def test_create_school_without_auth(client):
    """Test that unauthenticated users cannot create schools."""
    school_data = {"name": "Unauthorized School", "curriculum": "Test"}
    response = client.post("/api/schools/", json=school_data)
    assert response.status_code == 401


# ===== Update School Tests (Admin Only) =====


def test_update_school_as_admin(client, admin_token, sample_schools):
    """Test updating a school as admin."""
    school_id = sample_schools[0].id
    update_data = {"name": "Updated School Name", "curriculum": "Updated Curriculum"}
    response = client.put(
        f"/api/schools/{school_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated School Name"
    assert data["curriculum"] == "Updated Curriculum"


def test_update_school_as_regular_user(client, user_token, sample_schools):
    """Test that regular users cannot update schools."""
    school_id = sample_schools[0].id
    update_data = {"name": "Hacked Name"}
    response = client.put(
        f"/api/schools/{school_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 403


def test_update_nonexistent_school(client, admin_token):
    """Test updating a non-existent school."""
    update_data = {"name": "Does Not Exist"}
    response = client.put(
        "/api/schools/99999",
        json=update_data,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 404


# ===== Delete School Tests (Admin Only) =====


def test_delete_school_as_admin(client, admin_token, sample_schools):
    """Test deleting a school as admin."""
    school_id = sample_schools[0].id
    response = client.delete(
        f"/api/schools/{school_id}", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 204

    # Verify school is deleted
    get_response = client.get(f"/api/schools/{school_id}")
    assert get_response.status_code == 404


def test_delete_school_as_regular_user(client, user_token, sample_schools):
    """Test that regular users cannot delete schools."""
    school_id = sample_schools[0].id
    response = client.delete(
        f"/api/schools/{school_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 403


def test_delete_nonexistent_school(client, admin_token):
    """Test deleting a non-existent school."""
    response = client.delete(
        "/api/schools/99999", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 404


# ===== Schema Validation Tests =====


def test_create_school_validation_error(client, admin_token):
    """Test that invalid data is rejected."""
    invalid_data = {"name": "", "curriculum": "Test"}  # Empty name should fail
    response = client.post(
        "/api/schools/",
        json=invalid_data,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 422  # Validation error


def test_create_school_with_invalid_coordinates(client, admin_token):
    """Test that invalid GPS coordinates are rejected."""
    invalid_data = {
        "name": "Test School",
        "latitude": 999,  # Invalid latitude
        "longitude": 999,  # Invalid longitude
    }
    response = client.post(
        "/api/schools/",
        json=invalid_data,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 422
