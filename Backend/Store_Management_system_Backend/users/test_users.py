import pytest
import mongomock
from mongoengine import connect, disconnect
from users.models import User, UserRole
from django.contrib.auth.hashers import make_password, check_password


@pytest.fixture(scope="function", autouse=True)
def mongo_test_connection():
    """Set up and tear down a mock MongoDB connection for each test."""
    disconnect()  # Ensure no previous connections interfere
    connect(
        db="testdb",
        host="mongodb://localhost",  # dummy URI required by mongoengine
        mongo_client_class=mongomock.MongoClient,  # <-- updated usage
    )
    yield
    disconnect()


def test_create_user():
    """Test creating and retrieving a normal user."""
    user = User(
        full_name="Test User",
        username="testuser",
        role=UserRole.CASHIER,
        password="password123",
        confirm_password="password123",
    )
    user.save()

    retrieved_user = User.objects(username="testuser").first()
    assert retrieved_user is not None
    assert retrieved_user.full_name == "Test User"
    assert retrieved_user.role == UserRole.CASHIER
    assert retrieved_user.password == "password123"


def test_create_admin_user():
    """Test creating and retrieving an admin user."""
    admin_user = User(
        full_name="Admin User",
        username="adminuser",
        role=UserRole.ADMIN,
        password="password123",
        confirm_password="password123",
    )
    admin_user.save()

    retrieved_user = User.objects(username="adminuser").first()
    assert retrieved_user is not None
    assert retrieved_user.full_name == "Admin User"
    assert retrieved_user.role == UserRole.ADMIN


def test_duplicate_username_raises_error():
    """Test that creating a user with a duplicate username raises an error."""
    User(
        full_name="First User",
        username="duplicateuser",
        role=UserRole.CASHIER,
        password="password123",
        confirm_password="password123",
    ).save()

    import mongoengine.errors

    with pytest.raises(mongoengine.errors.NotUniqueError):
        User(
            full_name="Second User",
            username="duplicateuser",
            role=UserRole.MANAGER,
            password="password456",
            confirm_password="password456",
        ).save()

def test_create_multiple_roles():
    """Test creation of users with different roles."""
    roles = [UserRole.MANAGER, UserRole.CASHIER, UserRole.INVENTORY_MANAGER]
    for i, role in enumerate(roles):
        u = User(
            full_name=f"User {i}",
            username=f"user{i}",
            role=role,
            password="password123",
            confirm_password="password123",
        )
        u.save()

    all_users = User.objects()
    assert len(all_users) == 3
    assert all(user.role in roles for user in all_users)
