from django.urls import path, include
from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    
    path('api/', include('api.urls')),
    path('login/', views.login_user, name='login'),
    path('register/', view=views.register_staff, name='register'),
    path('password/change/', view=views.change_password, name='change_password'),
    path('delete/', view=views.delete_user, name='delete_user'),
]