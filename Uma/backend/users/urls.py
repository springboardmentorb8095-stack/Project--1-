# users/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    MeProfileView,
    ProfileClientView,
    ProfileSearchFilterView,
    home,
)

urlpatterns = [
    path('', home, name='home'),

    # 🔐 Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 👤 Profile management
    path('profile/', MeProfileView.as_view(), name='profile'),
    path('client/profile/', ProfileClientView.as_view(), name='client-profile'),

    # 🔎 Search + Filter API
    path('profiles/search/', ProfileSearchFilterView.as_view(), name='profile-search'),
]
