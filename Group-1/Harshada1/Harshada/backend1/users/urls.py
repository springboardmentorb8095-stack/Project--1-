from django.urls import path
from .views import (
    RegisterView,
    MeProfileView,
    ProfileClientView,
    ProfileFreelancerView,
    ProfileSearchFilterView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/profile/", MeProfileView.as_view(), name="me-profile"),
    path("client/profile/", ProfileClientView.as_view(), name="client-profile"),
    path("freelancer/profile/", ProfileFreelancerView.as_view(), name="freelancer-profile"),
    path("profiles/search/", ProfileSearchFilterView.as_view(), name="profile-search"),
]
