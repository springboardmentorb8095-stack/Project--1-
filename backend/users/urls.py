# users/urls.py
from django.urls import path
from .views import RegisterView, MeProfileView, home
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', home, name='home'),  # ✅ root test
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', MeProfileView.as_view(), name='profile'),
]
