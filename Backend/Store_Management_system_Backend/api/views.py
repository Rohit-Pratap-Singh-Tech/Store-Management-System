from rest_framework.decorators import api_view
from rest_framework.response import Response
from decimal import Decimal, InvalidOperation
from mongoengine.errors import DoesNotExist
from rest_framework import status
from datetime import datetime, timedelta
from .models import Category, Product, Sale, Transaction
from .serializers import CategorySerializer
from email.message import EmailMessage
from pymongo import MongoClient
import smtplib
import os

# --- MongoDB connection for user queries ---
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["Store_Management_System"]
users_collection = db["users"]

# --- Email Configuration from Environment ---
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "465"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM", EMAIL_USER)


# --- Email Utility ---
def send_email(subject, body, recipients):
    """Reusable email sender with environment variable configuration"""
    if not recipients:
        print("No recipients provided")
        return

    if not EMAIL_USER or not EMAIL_PASSWORD:
        print("⚠️ Warning: Email credentials not configured in .env file")
        return

    try:
        msg = EmailMessage()
        msg["From"] = EMAIL_FROM
        msg["To"] = ", ".join(recipients)
        msg["Subject"] = subject
        msg.set_content(body)

        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT) as smtp:
            smtp.login(EMAIL_USER, EMAIL_PASSWORD)
            smtp.send_message(msg)

        print(f"✅ Email sent successfully to {len(recipients)} recipient(s)")
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")


# --- ADMIN ALERT FUNCTION ---
def send_admin_alert(product):
    """Send low-stock alert to all admins"""
    try:
        admin_emails = [
            user["username"] for user in users_collection.find(
                {"role": "Admin"},  # ✅ Case-sensitive fix
                {"username": 1, "_id": 0}
            ) if user.get("username")
        ]

        if not admin_emails:
            print("⚠️ No admin usernames (emails) found in database")
            return

        subject = f"⚠️ Low Stock Alert: {product.product_name}"
        body = (
            f"Dear Admin,\n\n"
            f"The product '{product.product_name}' is low on stock.\n"
            f"Current Quantity: {product.quantity_in_stock}\n"
            f"Location: {product.location}\n\n"
            f"Please take action to restock.\n\n"
            f"— Inventory Management System"
        )
        send_email(subject, body, admin_emails)
        print(f"📧 Admin alert sent for: {product.product_name}")
    except Exception as e:
        print(f"❌ Error sending admin alert: {str(e)}")


# --- MANAGER ALERT FUNCTION ---
def send_manager_alert(product):
    """Send low-stock alert to all managers"""
    try:
        manager_emails = [
            user["username"] for user in users_collection.find(
                {"role": "Manager"},
                {"username": 1, "_id": 0}
            ) if user.get("username")
        ]

        if not manager_emails:
            print("⚠️ No manager usernames (emails) found in database")
            return

        subject = f"⚠️ Stock Running Low: {product.product_name}"
        body = (
            f"Dear Manager,\n\n"
            f"The product '{product.product_name}' has limited stock left.\n"
            f"Current Quantity: {product.quantity_in_stock}\n"
            f"Location: {product.location}\n\n"
            f"Please coordinate with admin for restocking.\n\n"
            f"— Inventory Management System"
        )
        send_email(subject, body, manager_emails)
        print(f"📧 Manager alert sent for: {product.product_name}")
    except Exception as e:
        print(f"❌ Error sending manager alert: {str(e)}")

# -------------------- CATEGORY API --------------------

@api_view(['POST'])
def category_add(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "success", "message": "Category added successfully"}, status=201)
    return Response({"status": "error", "errors": serializer.errors}, status=400)


@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def category_delete(request):
    category_name = request.data.get('category_name')
    if not category_name:
        return Response({"status": "error", "message": "Category name is required"}, status=400)

    try:
        category = Category.objects.get(category_name=category_name)
        category.delete()
        return Response({"status": "success", "message": "Category deleted successfully"}, status=200)
    except DoesNotExist:
        return Response({"status": "error", "message": "Category not found"}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(['PUT'])
def category_update(request):
    category_name = request.data.get('category_name')
    new_category_name = request.data.get('new_category_name')
    new_location = request.data.get('new_location', '')
    description = request.data.get('description', '')

    if not category_name or not new_category_name:
        return Response({"status": "error", "message": "Category name and new category name are required"}, status=400)

    try:
        if Category.objects(category_name=new_category_name).first() and category_name != new_category_name:
            return Response({"status": "error", "message": "Category with new name already exists"}, status=409)
        category = Category.objects.get(category_name=category_name)
        category.category_name = new_category_name
        category.description = description
        category.location = new_location if new_location else category.location
        category.save()
        return Response({"status": "success", "message": "Category updated successfully"}, status=200)
    except DoesNotExist:
        return Response({"status": "error", "message": "Category not found"}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(['GET'])
def category_search(request):
    category_name = request.query_params.get('category_name') or request.data.get('category_name')
    if not category_name:
        return Response({"status": "error", "message": "Category name is required"}, status=400)

    try:
        category = Category.objects.get(category_name=category_name)
        products = Product.objects(category=category)
        product_list = [
            {
                "product_name": product.product_name,
                "price": str(product.price),
                "quantity_in_stock": product.quantity_in_stock,
                "location": product.location
            } for product in products
        ]
        return Response({
            "status": "success",
            "category": {
                "category_name": category.category_name,
                "description": category.description,
                "products": product_list
            }
        }, status=200)
    except DoesNotExist:
        return Response({"status": "error", "message": "Category not found"}, status=404)


# -------------------- PRODUCT API --------------------

@api_view(['POST'])
def product_add(request):
    product_name = request.data.get('product_name')
    price = request.data.get('price')
    category_name = request.data.get('category_name')
    quantity_in_stock = request.data.get('quantity_in_stock')
    location = request.data.get('location', '')

    if not all([product_name, price, category_name, quantity_in_stock is not None]):
        return Response(
            {"status": "error", "message": "Product name, price, category, and quantity are required"},
            status=400
        )

    try:
        if Product.objects(product_name=product_name).first():
            return Response({"status": "error", "message": "Product already exists"}, status=409)

        category = Category.objects.get(category_name=category_name)
        product = Product(
            product_name=product_name,
            price=Decimal(str(price)),
            category=category,
            quantity_in_stock=int(quantity_in_stock),
            location=location
        )
        product.save()

        # ✅ Check if low stock alert needed on creation
        if product.quantity_in_stock < 5:
            send_admin_alert(product)
            send_manager_alert(product)

        return Response({"status": "success", "message": "Product added successfully"}, status=201)
    except DoesNotExist:
        return Response({"status": "error", "message": "Category not found"}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(['DELETE'])
def product_delete(request):
    product_name = request.data.get('product_name')
    if not product_name:
        return Response({"status": "error", "message": "Product name is required"}, status=400)

    try:
        product = Product.objects.get(product_name=product_name)
        product.delete()
        return Response({"status": "success", "message": "Product deleted successfully"}, status=200)
    except DoesNotExist:
        return Response({"status": "error", "message": "Product not found"}, status=404)


@api_view(['PUT'])
def product_update(request):
    """Update product and send email alerts if stock falls below 5"""
    product_name = request.data.get('product_name')
    new_product_name = request.data.get('new_product_name')
    new_price = request.data.get('price')
    category_name = request.data.get('category_name')
    quantity_in_stock = request.data.get('quantity_in_stock')
    new_location = request.data.get('location', '')

    if not product_name:
        return Response({"status": "error", "message": "Product name is required"}, status=400)

    try:
        product = Product.objects.get(product_name=product_name)

        if new_product_name and new_product_name != product_name:
            if Product.objects(product_name=new_product_name).first():
                return Response({"status": "error", "message": "New product name already exists"}, status=409)
            product.product_name = new_product_name

        if new_price is not None:
            product.price = Decimal(str(new_price))

        if category_name:
            category = Category.objects.get(category_name=category_name)
            product.category = category

        if quantity_in_stock is not None:
            product.quantity_in_stock = int(quantity_in_stock)

        if new_location:
            product.location = new_location

        product.save()

        # ✅ Send email alerts if stock is below threshold
        alert_sent = False
        if product.quantity_in_stock < 5:
            send_admin_alert(product)
            send_manager_alert(product)
            alert_sent = True

        return Response({
            "status": "success",
            "message": "Product updated successfully",
            "low_stock_alert_sent": alert_sent,
            "current_stock": product.quantity_in_stock
        }, status=200)

    except DoesNotExist:
        return Response({"status": "error", "message": "Product or category not found"}, status=404)


@api_view(['GET'])
def product_list(request):
    try:
        products = Product.objects.all()
        product_data = [
            {
                "product_name": p.product_name,
                "price": str(p.price),
                "category": p.category.category_name if p.category else None,
                "quantity_in_stock": p.quantity_in_stock,
                "location": p.location
            }
            for p in products
        ]
        return Response({"status": "success", "products": product_data}, status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(['GET'])
def product_search(request):
    product_name = request.query_params.get('product_name') or request.data.get('product_name')
    if not product_name:
        return Response({"status": "error", "message": "Product name is required"}, status=400)

    try:
        product = Product.objects.get(product_name=product_name)
        return Response({
            "status": "success",
            "product": {
                "product_name": product.product_name,
                "price": str(product.price),
                "category": product.category.category_name if product.category else None,
                "quantity_in_stock": product.quantity_in_stock,
                "last_updated": product.last_updated.isoformat() if product.last_updated else None,
                "location": product.location
            }
        }, status=200)
    except DoesNotExist:
        return Response({"status": "error", "message": "Product not found"}, status=404)


# -------------------- SALE API --------------------

@api_view(['POST'])
def sale_add(request):
    employee_username = request.data.get('employee_username')
    total_amount = request.data.get('total_amount')

    if not all([employee_username, total_amount is not None]):
        return Response(
            {"status": "error", "message": "Employee username and total amount are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        total_amount = Decimal(str(total_amount))
    except (InvalidOperation, ValueError, TypeError):
        return Response(
            {"status": "error", "message": "Invalid total amount"},
            status=status.HTTP_400_BAD_REQUEST
        )

    sale = Sale(employee=employee_username, total_amount=total_amount)
    sale.save()
    return Response(
        {
            "status": "success",
            "message": "Sale added successfully",
            "sale_id": str(sale.id),
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
def sale_list(request):
    try:
        sales = Sale.objects.all()
        sales_data = [
            {
                "sale_id": str(s.id),
                "employee_username": s.employee,
                "total_amount": str(s.total_amount),
                "sale_date": s.sale_date.isoformat() if s.sale_date else None
            }
            for s in sales
        ]
        return Response({"status": "success", "sales": sales_data}, status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(['GET'])
def sale_search(request):
    employee_username = request.query_params.get('employee_username') or request.data.get('employee_username')
    if not employee_username:
        return Response(
            {"status": "error", "message": "Employee username is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    sales = Sale.objects(employee=employee_username)
    if not sales:
        return Response(
            {"status": "error", "message": "No sales found for this employee"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {
            "status": "success",
            "sales": [
                {
                    "sale_id": str(sale.id),
                    "employee_username": sale.employee,
                    "total_amount": str(sale.total_amount),
                    "sale_date": sale.sale_date.isoformat() if sale.sale_date else None
                }
                for sale in sales
            ]
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def sell_this_week(request):
    """Get all sales from the last 7 days"""
    today = datetime.utcnow()
    week_ago = today - timedelta(days=7)

    sales = Sale.objects(sale_date__gte=week_ago, sale_date__lte=today)

    return Response({
        "status": "success",
        "sales_count": sales.count(),
        "total_amount": str(sum(sale.total_amount for sale in sales)),
        "sales": [
            {
                "sale_id": str(sale.id),
                "employee_username": sale.employee,
                "total_amount": str(sale.total_amount),
                "sale_date": sale.sale_date.isoformat() if sale.sale_date else None
            }
            for sale in sales
        ]
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def sell_this_month(request):
    """Get all sales for the current month"""
    today = datetime.utcnow()
    start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    sales = Sale.objects(sale_date__gte=start_of_month, sale_date__lte=today)

    return Response({
        "status": "success",
        "sales_count": sales.count(),
        "total_amount": str(sum(sale.total_amount for sale in sales)),
        "sales": [
            {
                "sale_id": str(sale.id),
                "employee_username": sale.employee,
                "total_amount": str(sale.total_amount),
                "sale_date": sale.sale_date.isoformat() if sale.sale_date else None
            }
            for sale in sales
        ]
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def sell_this_year(request):
    """Get all sales for the current year"""
    today = datetime.utcnow()
    start_of_year = today.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

    sales = Sale.objects(sale_date__gte=start_of_year, sale_date__lte=today)

    return Response({
        "status": "success",
        "sales_count": sales.count(),
        "total_amount": str(sum(sale.total_amount for sale in sales)),
        "sales": [
            {
                "sale_id": str(sale.id),
                "employee_username": sale.employee,
                "total_amount": str(sale.total_amount),
                "sale_date": sale.sale_date.isoformat() if sale.sale_date else None
            }
            for sale in sales
        ]
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def sell_per_week(request):
    """Get sales grouped by ISO week for all time"""
    pipeline = [
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$sale_date"},
                    "week": {"$isoWeek": "$sale_date"}
                },
                "total_amount": {"$sum": "$total_amount"},
                "sales_count": {"$sum": 1}
            }
        },
        {"$sort": {"_id.year": 1, "_id.week": 1}}
    ]

    sales = Sale.objects.aggregate(*pipeline)

    result = [
        {
            "year": s["_id"]["year"],
            "week": s["_id"]["week"],
            "sales_count": s["sales_count"],
            "total_amount": str(s["total_amount"])
        }
        for s in sales
    ]

    return Response({"status": "success", "data": result}, status=status.HTTP_200_OK)


@api_view(['GET'])
def sell_per_month(request):
    """Get sales grouped by month for all time"""
    pipeline = [
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$sale_date"},
                    "month": {"$month": "$sale_date"}
                },
                "total_amount": {"$sum": "$total_amount"},
                "sales_count": {"$sum": 1}
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]

    sales = Sale.objects.aggregate(*pipeline)

    result = [
        {
            "year": s["_id"]["year"],
            "month": s["_id"]["month"],
            "sales_count": s["sales_count"],
            "total_amount": str(s["total_amount"])
        }
        for s in sales
    ]

    return Response({"status": "success", "data": result}, status=status.HTTP_200_OK)


@api_view(['GET'])
def sell_per_year(request):
    """Get sales grouped by year for all time"""
    pipeline = [
        {
            "$group": {
                "_id": {"year": {"$year": "$sale_date"}},
                "total_amount": {"$sum": "$total_amount"},
                "sales_count": {"$sum": 1}
            }
        },
        {"$sort": {"_id.year": 1}}
    ]

    sales = Sale.objects.aggregate(*pipeline)

    result = [
        {
            "year": s["_id"]["year"],
            "sales_count": s["sales_count"],
            "total_amount": str(s["total_amount"])
        }
        for s in sales
    ]

    return Response({"status": "success", "data": result}, status=status.HTTP_200_OK)


# ---------------------Transaction Api---------------------------

@api_view(['POST'])
def transaction_add(request):
    items = request.data.get("items")
    employee = request.data.get("employee")

    if not all([items, employee]):
        return Response(
            {"status": "error", "message": "Employee and items are required"},
            status=400
        )

    if not isinstance(items, list) or len(items) == 0:
        return Response({"status": "error", "message": "Items must be a non-empty list"}, status=400)

    transactions_data = []
    total_amount = Decimal("0.00")

    for item in items:
        product_name = item.get("product_name")
        quantity_sold = item.get("quantity_sold")

        if not all([product_name, quantity_sold]):
            return Response({"status": "error", "message": "Each item must have product_name and quantity_sold"},
                            status=400)

        try:
            product = Product.objects(product_name=product_name).first()
            if not product:
                return Response({"status": "error", "message": f"Product '{product_name}' not found"}, status=404)

            quantity_sold = int(quantity_sold)

            if product.quantity_in_stock < quantity_sold:
                return Response({
                    "status": "error",
                    "message": f"Not enough stock for {product_name}. Available: {product.quantity_in_stock}, Requested: {quantity_sold}"
                }, status=400)

            price_at_sale = Decimal(str(product.price))
            item_total = quantity_sold * price_at_sale
            total_amount += item_total

            transactions_data.append({
                "product": product,
                "quantity_sold": quantity_sold,
                "price_at_sale": price_at_sale,
                "item_total": item_total
            })

        except ValueError:
            return Response({"status": "error", "message": "Invalid quantity"}, status=400)

    sale = Sale(
        employee=employee,
        total_amount=total_amount
    ).save()

    transaction_ids = []
    for t in transactions_data:
        transaction = Transaction(
            sale=sale,
            product=t["product"],
            quantity_sold=t["quantity_sold"],
            price_at_sale=t["price_at_sale"]
        ).save()

        t["product"].quantity_in_stock -= t["quantity_sold"]
        t["product"].save()

        # ✅ Check if low stock alert needed after transaction
        if t["product"].quantity_in_stock < 5:
            send_admin_alert(t["product"])
            send_manager_alert(t["product"])

        transaction_ids.append(str(transaction.id))

    return Response({
        "status": "success",
        "message": "Sale with multiple transactions added successfully, stock updated",
        "sale_id": str(sale.id),
        "transaction_ids": transaction_ids,
        "total_amount": str(total_amount),
        "items": [
            {
                "product": t["product"].product_name,
                "sold_quantity": t["quantity_sold"],
                "price_per_unit": str(t["price_at_sale"]),
                "item_total": str(t["item_total"]),
                "remaining_stock": t["product"].quantity_in_stock
            }
            for t in transactions_data
        ]
    }, status=201)


@api_view(['GET'])
def transaction_list(request):
    transactions = Transaction.objects.all()
    if not transactions:
        return Response({"status": "error", "message": "No transactions found"}, status=404)

    return Response({
        "status": "success",
        "transactions": [
            {
                "transaction_id": str(tx.id),
                "sale_id": str(tx.sale.id) if tx.sale else None,
                "employee": tx.sale.employee if tx.sale and tx.sale.employee else None,
                "product_id": str(tx.product.id) if tx.product else None,
                "product_name": tx.product.product_name if tx.product else None,
                "quantity_sold": tx.quantity_sold,
                "price_at_sale": str(tx.price_at_sale),
            }
            for tx in transactions
        ]
    })


@api_view(['GET'])
def transaction_search_with_employee(request):
    employee_username = request.query_params.get('employee_username') or request.data.get('employee_username')
    if not employee_username:
        return Response({"status": "error", "message": "employee_username is required"}, status=400)

    sales = Sale.objects(employee=employee_username)
    if not sales:
        return Response({"status": "error", "message": f"No sales found for employee '{employee_username}'"},
                        status=404)

    return Response({
        "status": "success",
        "employee_username": employee_username,
        "sales": [
            {
                "sale_id": str(sale.id),
                "total_amount": str(sale.total_amount),
                "sale_date": sale.sale_date.isoformat() if sale.sale_date else None,
                "transactions": [
                    {
                        "transaction_id": str(tx.id),
                        "product_id": str(tx.product.id) if tx.product else None,
                        "product_name": tx.product.product_name if tx.product else None,
                        "quantity_sold": tx.quantity_sold,
                        "price_at_sale": str(tx.price_at_sale),
                    }
                    for tx in Transaction.objects(sale=sale)
                ]
            }
            for sale in sales
        ]
    })