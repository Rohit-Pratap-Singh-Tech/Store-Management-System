from django.urls import path
from . import views

urlpatterns = [
    path("create-order/", views.create_order, name="create_order"),
    path("verify-payment/", views.verify_payment, name="verify_payment"),
path("get-payment-status/<str:order_id>/", views.get_payment_status, name="get_payment_status"),
]
