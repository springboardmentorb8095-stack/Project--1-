# users/urls.py
from django.urls import path
from .views import RegisterView, MeProfileView, ProfileSearchFilterView, home

urlpatterns = [
    path('', home, name='home'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeProfileView.as_view(), name='me-profile'),

    # ✅ New Search & Filter API
    path('profiles/search/', ProfileSearchFilterView.as_view(), name='profile-search'),
]
