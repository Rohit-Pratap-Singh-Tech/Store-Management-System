from django.urls import path, include
from . import views

urlpatterns = [
    path('api/', include('api.urls')),
    path('login/', views.login_user, name='login'),
    path('register/', view=views.register_staff, name='register'),
    path('password/change/', view=views.change_password, name='change_password'),
    path('delete/', view=views.delete_user, name='delete_user'),
]