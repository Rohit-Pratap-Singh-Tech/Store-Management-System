from django.urls import path
from . import views

urlpatterns = [
    # Product URLs
    path('product/add', views.product_add, name='product_add'),
    path('product/update', views.product_update, name='product_update'),
    path('product/delete', views.product_delete, name='product_delete'),
    path('product/list', views.product_list, name='product_list'),
    path('product/search', views.product_search, name='product_search'),

    # # Category URLs
    path('category/add', views.category_add, name='category_add'),
    path('category_add', views.category_add, name='category_add_alt'),  # Alternative URL for compatibility
    path('category/update', views.category_update, name='category_update'),
    path('category/delete', views.category_delete, name='category_delete'),
    path('category/list', views.category_list, name='category_list'),
    path('category/search', views.category_search, name='category_search'),

    # # Sales URLs
    # path('sale/add', views.sale_add, name='sale_add'),
    # path('sale/list', views.sale_list, name='sale_list'),
    # path('sale/search', views.sale_search, name='sale_search'),
    #
    # # Transaction URLs
    # path('transaction/add', views.transaction_add, name='transaction_add'),
    # path('transaction/list', views.transaction_list, name='transaction_list'),
    # path('transaction/search', views.transaction_search, name='transaction_search'),
    # path('transaction/employee_sales', views.employee_sales, name='employee_sales'),
    # path('transaction/employee_sales/username/<str:employee_username>', views.employee_sales_by_username, name='employee_sales_by_username'),
    # path('transaction/employee_sales/date/<str:date>', views.employee_sales_by_date, name='employee_sales_by_date'),
    #

]
