# users/urls.py
from django.urls import path
<<<<<<< HEAD
from .views import RegisterView, MeProfileView, home
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from .views import ProfileClientView, ProfileFreelancerView
=======
from .views import RegisterView, MeProfileView, ProfileSearchFilterView, home
>>>>>>> cad77ed10b3d6ee548919fe3a9a44c51d76a74e8

urlpatterns = [
    path('', home, name='home'),
    path('register/', RegisterView.as_view(), name='register'),
<<<<<<< HEAD
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', MeProfileView.as_view(), name='profile'),
#     path("client/profile/", ProfileClientView.as_view(), name="client-profile"),
#     path("freelancer/profile/", ProfileFreelancerView.as_view(), name="freelancer-profile"),
=======
    path('me/', MeProfileView.as_view(), name='me-profile'),

    # ✅ New Search & Filter API
    path('profiles/search/', ProfileSearchFilterView.as_view(), name='profile-search'),
>>>>>>> cad77ed10b3d6ee548919fe3a9a44c51d76a74e8
]
