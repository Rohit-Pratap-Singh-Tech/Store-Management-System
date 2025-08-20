from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Product, Sale
from .serializers import CategorySerializer, ProductSerializer, SaleSerializer
from decimal import Decimal
from mongoengine.errors import DoesNotExist


# -------------------- CATEGORY API --------------------

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer


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

'''{
    "category_name": "Electronics",
}'''
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

'''{
    "category_name": "Electronics",
    "new_category_name":"Computer",
    "description": "Gadgets, devices, and accessories."
}'''
@api_view(['PUT'])
def category_update(request):
    category_name = request.data.get('category_name')
    new_category_name = request.data.get('new_category_name')
    description = request.data.get('description', '')

    if not category_name or not new_category_name:
        return Response({"status": "error", "message": "Category name and new category name are required"}, status=400)

    try:
        if Category.objects(category_name=new_category_name).first() and category_name != new_category_name:
            return Response({"status": "error", "message": "Category with new name already exists"}, status=409)

        category = Category.objects.get(category_name=category_name)
        category.category_name = new_category_name
        category.description = description
        category.save()
        return Response({"status": "success", "message": "Category updated successfully"}, status=200)
    except DoesNotExist:
        return Response({"status": "error", "message": "Category not found"}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

'''
{
    "category_name": "Computer"
}

{
    "status": "success",
    "category": {
        "category_name": "Computer",
        "description": "Gadgets, devices, and accessories.",
        "products": []
    }
}'''
@api_view(['GET'])
def category_search(request):
    category_name = request.data.get('category_name')
    if not category_name:
        return Response({"status": "error", "message": "Category name is required"}, status=400)

    try:
        category = Category.objects.get(category_name=category_name)
        products = Product.objects(category=category)
        product_list = [
            {
                "product_name": product.product_name,
                "price": str(product.price),
                "quantity_in_stock": product.quantity_in_stock
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


#
# # -------------------- PRODUCT API --------------------
#
'''{
    "product_name": "Computer1",
    "price": 999.99,
    "category_name": "Computer",
    "quantity_in_stock": 10
}'''
@api_view(['POST'])
def product_add(request):
    product_name = request.data.get('product_name')
    price = request.data.get('price')
    category_name = request.data.get('category_name')
    quantity_in_stock = request.data.get('quantity_in_stock')

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
            quantity_in_stock=int(quantity_in_stock)
        )
        product.save()
        return Response({"status": "success", "message": "Product added successfully"}, status=201)
    except DoesNotExist:
        return Response({"status": "error", "message": "Category not found"}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

'''
{
    "product_name": "Computer1"
}
'''
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


'''
{
    "product_name": "Laptop1",      // Required: Current name of the product to update
    "new_product_name": "Laptop3",    // Optional: New name for the product
    "price": 1299.99,                 // Optional: New price for the product
    "category_name": "Electronics",    // Optional: New category for the product
    "quantity_in_stock": 15           // Optional: New stock quantity
}
'''
@api_view(['PUT'])
def product_update(request):
    product_name = request.data.get('product_name')
    new_product_name = request.data.get('new_product_name')
    price = request.data.get('price')
    category_name = request.data.get('category_name')
    quantity_in_stock = request.data.get('quantity_in_stock')

    if not product_name:
        return Response({"status": "error", "message": "Product name is required"}, status=400)

    try:
        product = Product.objects.get(product_name=product_name)

        if new_product_name and new_product_name != product_name:
            if Product.objects(product_name=new_product_name).first():
                return Response({"status": "error", "message": "New product name already exists"}, status=409)
            product.product_name = new_product_name

        if price is not None:
            product.price = Decimal(str(price))

        if category_name:
            category = Category.objects.get(category_name=category_name)
            product.category = category

        if quantity_in_stock is not None:
            product.quantity_in_stock = int(quantity_in_stock)

        product.save()
        return Response({"status": "success", "message": "Product updated successfully"}, status=200)
    except DoesNotExist:
        return Response({"status": "error", "message": "Product or category not found"}, status=404)

# for all products if you want to search by category of product go to upper in category_search
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
                "last_updated": p.last_updated.isoformat() if p.last_updated else None
            }
            for p in products
        ]
        return Response({"status": "success", "products": product_data}, status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

#
# # -------------------- SALE API --------------------
#
# @api_view(['POST'])
# def sale_add(request):
#     employee_username = request.data.get('employee_username')
#     total_amount = request.data.get('total_amount')
#
#     if not all([employee_username, total_amount]):
#         return Response({"status": "error", "message": "Employee username and total amount required"}, status=400)
#
#     try:
#         from django.contrib.auth import get_user_model
#         User = get_user_model()
#
#         employee = User.objects.get(username=employee_username)
#         sale = Sale(employee=employee, total_amount=Decimal(str(total_amount)))
#         sale.save()
#         return Response({"status": "success", "message": "Sale added successfully", "sale_id": str(sale.id)}, status=201)
#     except User.DoesNotExist:
#         return Response({"status": "error", "message": "Employee not found"}, status=404)
#
#
# @api_view(['GET'])
# def sale_list(request):
#     try:
#         sales = Sale.objects.all()
#         sales_data = [
#             {
#                 "sale_id": str(s.id),
#                 "employee_username": s.employee.username if s.employee else None,
#                 "total_amount": str(s.total_amount),
#                 "sale_date": s.sale_date.isoformat() if s.sale_date else None
#             }
#             for s in sales
#         ]
#         return Response({"status": "success", "sales": sales_data}, status=200)
#     except Exception as e:
#         return Response({"status": "error", "message": str(e)}, status=500)
#
#
# @api_view(['GET'])
# def sale_search(request):
#     sale_id = request.query_params.get('sale_id')
#     if not sale_id:
#         return Response({"status": "error", "message": "Sale ID is required"}, status=400)
#
#     try:
#         sale = Sale.objects.get(id=sale_id)
#         return Response({
#             "status": "success",
#             "sale": {
#                 "sale_id": str(sale.id),
#                 "employee_username": sale.employee.username if sale.employee else None,
#                 "total_amount": str(sale.total_amount),
#                 "sale_date": sale.sale_date.isoformat() if sale.sale_date else None
#             }
#         }, status=200)
#     except DoesNotExist:
#         return Response({"status": "error", "message": "Sale not found"}, status=404)
