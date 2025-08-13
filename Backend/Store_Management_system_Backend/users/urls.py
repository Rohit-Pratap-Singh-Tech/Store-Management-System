from django.urls import path, include
from . import views

urlpatterns = [
    # path('api/', include('api.urls')),
    path('login/', views.login_user, name='login'),
    path('register/', view=views.register_staff, name='register'),
    path('password/change/', view=views.change_password, name='change_password'),
    # data will go while login that will be used for profile
    # path('profile/', view=views.Profile, name='profile'),
]