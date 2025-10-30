# api/test_inventory_fixed.py
import pytest
from rest_framework.test import APIClient
from unittest.mock import patch
from decimal import Decimal
from api.models import Category, Product, Sale, Transaction

# NOTE: your actual URL prefix (project -> users -> api) makes endpoints start with /users/api/
BASE = "/users/api"  # use this prefix for all endpoint paths


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture(autouse=True)
def clean_db():
    # Automatically clears the database before each test
    Category.drop_collection()
    Product.drop_collection()
    Sale.drop_collection()
    Transaction.drop_collection()


# -------------------- CATEGORY TESTS --------------------

def test_add_category(api_client):
    response = api_client.post(f'{BASE}/category/add', {
        "category_name": "Electronics",
        "description": "Electronic items",
        "location": "Shelf A1"
    }, format='json')
    assert response.status_code == 201
    assert Category.objects.count() == 1


def test_list_categories(api_client):
    Category(category_name="Grocery").save()
    Category(category_name="Clothes").save()
    response = api_client.get(f'{BASE}/category/list')
    assert response.status_code == 200
    # your view returns a list (serializer.data)
    assert isinstance(response.data, list)
    assert len(response.data) == 2


def test_update_category(api_client):
    Category(category_name="Furniture").save()
    response = api_client.put(f'{BASE}/category/update', {
        "category_name": "Furniture",
        "new_category_name": "Home Furniture",
        "description": "Updated category",
        "new_location": "Section 3"
    }, format='json')
    assert response.status_code == 200
    assert Category.objects.first().category_name == "Home Furniture"


def test_delete_category(api_client):
    Category(category_name="Old").save()
    # your delete view expects JSON body (you used request.data), so send body
    response = api_client.delete(f'{BASE}/category/delete', {
        "category_name": "Old"
    }, format='json')
    assert response.status_code == 200
    assert Category.objects.count() == 0




# -------------------- PRODUCT TESTS --------------------

@patch("api.views.send_admin_alert")
@patch("api.views.send_manager_alert")
def test_add_product(mock_manager_alert, mock_admin_alert, api_client):
    # Note: order of patches -> first param is innermost patch; adjust asserts accordingly
    Category(category_name="Stationery").save()
    response = api_client.post(f'{BASE}/product/add', {
        "product_name": "Pen",
        "price": "10.00",
        "category_name": "Stationery",
        "quantity_in_stock": 2,
        "location": "Rack 1"
    }, format='json')
    assert response.status_code == 201
    assert Product.objects.count() == 1
    # low-stock alert should have been triggered for quantity 2
    mock_admin_alert.assert_called()
    mock_manager_alert.assert_called()


def test_list_products(api_client):
    cat = Category(category_name="Toys").save()
    Product(product_name="Car", price=Decimal("50.00"), category=cat, quantity_in_stock=5).save()
    response = api_client.get(f'{BASE}/product/list')
    assert response.status_code == 200
    # your view returns {"status":"success","products": [...]}
    assert "products" in response.data
    assert len(response.data["products"]) == 1


def test_update_product(api_client):
    cat = Category(category_name="Books").save()
    Product(product_name="Notebook", price=Decimal("30.00"), category=cat, quantity_in_stock=10).save()
    response = api_client.put(f'{BASE}/product/update', {
        "product_name": "Notebook",
        "new_product_name": "Notebook Pro",
        "price": "35.00",
        "quantity_in_stock": 3
    }, format='json')
    assert response.status_code == 200
    assert Product.objects.first().product_name == "Notebook Pro"


def test_delete_product(api_client):
    cat = Category(category_name="Drinks").save()
    Product(product_name="Juice", price=Decimal("20.00"), category=cat).save()
    response = api_client.delete(f'{BASE}/product/delete', {"product_name": "Juice"}, format='json')
    assert response.status_code == 200
    assert Product.objects.count() == 0


# -------------------- SALE TESTS --------------------

def test_add_sale(api_client):
    response = api_client.post(f'{BASE}/sale/add', {
        "employee_username": "test_user",
        "total_amount": "100.50"
    }, format='json')
    assert response.status_code == 201
    assert Sale.objects.count() == 1


def test_list_sales(api_client):
    Sale(employee="emp1", total_amount=Decimal("50.00")).save()
    Sale(employee="emp2", total_amount=Decimal("150.00")).save()
    response = api_client.get(f'{BASE}/sale/list')
    assert response.status_code == 200
    assert "sales" in response.data
    assert len(response.data["sales"]) == 2


# # -------------------- TRANSACTION TESTS --------------------
#
# @patch("api.views.send_admin_alert")
# @patch("api.views.send_manager_alert")
# def test_transaction_add(mock_manager_alert, mock_admin_alert, api_client):
#     cat = Category(category_name="Food").save()
#     Product(product_name="Pizza", price=Decimal("100.00"), category=cat, quantity_in_stock=5).save()
#
#     response = api_client.post(f'{BASE}/transaction/add/', {  # ✅ add trailing slash for consistency
#         "employee": "john",
#         "items": [
#             {"product_name": "Pizza", "quantity_sold": 2}
#         ]
#     }, format='json')
#
#     assert response.status_code == 201
#     assert Sale.objects.count() == 1
#     assert Transaction.objects.count() == 1
#     assert Product.objects.first().quantity_in_stock == 3
#     mock_admin_alert.assert_not_called()
#     mock_manager_alert.assert_not_called()
#
# import json
#
# def test_search_category(api_client):
#     cat = Category(category_name="Hardware").save()
#     Product(product_name="Hammer", price=Decimal("100.00"), quantity_in_stock=10, category=cat).save()
#
#     response = api_client.generic(
#         'GET',
#         f'{BASE}/category/search/',
#         data=json.dumps({"category_name": "Hardware"}),
#         content_type='application/json'
#     )
#
#     assert response.status_code == 200
#     assert response.data["category"]["category_name"] == "Hardware"
