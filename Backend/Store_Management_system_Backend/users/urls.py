from django.urls import path, include
from . import views

urlpatterns = [
    # path('api/', include('api.urls')),
    path('login/', view=views.login_user, name='login'),

    # path('logout/', view=views.Logoutw.as_view(), name='logout'),
    # path('register/', view=views.Register.as_view(), name='register'),
    # path('profile/', view=views.Profile.as_view(), name='profile'),
    # path('password/change/', view=views.ChangePassword.as_view(), name='change_password'),
]