import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from main import app
from db import Base, get_db
from models import User, Teacher
from auth import hash_password


SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_admin_payouts.db"
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
def teacher_user(db_session):
    user = User(email="teacher@test.com", hashed_password=hash_password("teachpass"), full_name="Teacher", is_active=True)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def test_set_stripe_account_and_request_payout(client, db_session, teacher_user):
    # create teacher record directly
    t = Teacher(user_id=teacher_user.id, full_name="Payout Teacher", hourly_rate_online=60.0)
    db_session.add(t)
    db_session.commit()
    db_session.refresh(t)

    # Log in as teacher_user via direct injection: override get_current_user not needed; we'll use admin flow by creating an admin user
    admin = User(email="admin@test.com", hashed_password=hash_password("admin123"), full_name="Admin", is_active=True, is_admin=True)
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)

    # monkeypatch auth dependency: override get_current_user to return admin
    from auth import get_current_user as real_get_current_user

    def override_admin_user():
        return admin

    app.dependency_overrides[real_get_current_user] = lambda: admin

    # Set stripe account id
    resp = client.put(f"/api/teachers/{t.id}/stripe-account", params={"stripe_account_id": "acct_test_123"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["stripe_account_id"] == "acct_test_123"

    # Request payout
    resp2 = client.post(f"/api/teachers/{t.id}/payouts", json={"amount": 50.0})
    assert resp2.status_code == 201
    payout = resp2.json()
    assert payout["amount"] == 50.0
    assert payout["status"] == "pending"

    app.dependency_overrides.pop(real_get_current_user, None)
