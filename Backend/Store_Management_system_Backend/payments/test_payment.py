import pytest
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from payments.models import Payment

BASE = "/payments"  # change this if your app URL prefix differs (e.g., '/api/payments')


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture(autouse=True)
def clean_db():
    Payment.drop_collection()


# -------------------- CREATE ORDER --------------------
@patch("payments.views.razorpay.Client")
def test_create_order_success(mock_client, api_client):
    """Should successfully create Razorpay order and save Payment"""
    mock_instance = MagicMock()
    mock_instance.order.create.return_value = {"id": "order_test_123", "amount": 50000}
    mock_client.return_value = mock_instance

    response = api_client.post(f"{BASE}/create-order/", {"amount": "500"}, format="json")

    assert response.status_code == 201
    data = response.data
    assert data["status"] == "success"
    assert "order" in data
    assert Payment.objects.count() == 1
    assert Payment.objects.first().status == "created"

# pass
def test_create_order_missing_amount(api_client):
    """Should fail if amount is missing"""
    response = api_client.post(f"{BASE}/create-order/", {}, format="json")
    assert response.status_code == 400
    assert "Amount is required" in response.data["message"]


@patch("payments.views.razorpay.Client")
def test_create_order_invalid_amount(mock_client, api_client):
    """Should fail if amount <= 0"""
    response = api_client.post(f"{BASE}/create-order/", {"amount": "0"}, format="json")
    assert response.status_code == 400
    assert "greater than 0" in response.data["message"]


# -------------------- VERIFY PAYMENT --------------------
@patch("payments.views.razorpay.Client")
def test_verify_payment_success(mock_client, api_client):
    """Should verify payment and update DB"""
    # create payment
    Payment(order_id="order_123", amount=10000, status="created").save()

    mock_instance = MagicMock()
    mock_instance.utility.verify_payment_signature.return_value = True
    mock_client.return_value = mock_instance

    data = {
        "razorpay_order_id": "order_123",
        "razorpay_payment_id": "pay_123",
        "razorpay_signature": "sig_abc",
    }

    response = api_client.post(f"{BASE}/verify-payment/", data, format="json")
    assert response.status_code == 200
    assert response.data["status"] == "success"

    payment = Payment.objects(order_id="order_123").first()
    assert payment.status == "paid"
    assert payment.payment_id == "pay_123"


@patch("payments.views.razorpay.Client")
def test_verify_payment_invalid_signature(mock_client, api_client):
    """Should fail if Razorpay signature verification fails"""
    Payment(order_id="order_999", amount=10000, status="created").save()

    mock_instance = MagicMock()
    mock_instance.utility.verify_payment_signature.side_effect = Exception("Invalid signature")
    mock_client.return_value = mock_instance

    data = {
        "razorpay_order_id": "order_999",
        "razorpay_payment_id": "pay_fail",
        "razorpay_signature": "sig_fail",
    }

    response = api_client.post(f"{BASE}/verify-payment/", data, format="json")
    assert response.status_code in [400, 500]

# pass
def test_verify_payment_missing_field(api_client):
    """Should fail if any required field is missing"""
    response = api_client.post(f"{BASE}/verify-payment/", {"razorpay_order_id": "order_1"}, format="json")
    assert response.status_code == 400
    assert "is required" in response.data["message"]


# -------------------- GET PAYMENT STATUS --------------------
def test_get_payment_status_success(api_client):
    payment = Payment(order_id="order_test", amount=5000, status="paid").save()
    response = api_client.get(f"{BASE}/get-payment-status/{payment.order_id}/")
    assert response.status_code == 200
    assert response.data["status"] == "success"
    assert response.data["payment"]["status"] == "paid"

# pass
def test_get_payment_status_not_found(api_client):
    response = api_client.get(f"{BASE}/get-payment-status/order_invalid/")
    assert response.status_code == 404
    if hasattr(response, "data"):
        assert "not found" in response.data["message"].lower()
    else:
        assert "not found" in response.content.decode().lower()
