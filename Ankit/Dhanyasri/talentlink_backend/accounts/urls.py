from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views import (
    test_view,
    RegisterView,
    ClientProfileView,
    FreelancerProfileView,
    ProfileViewSet,
    ProjectViewSet,
    ProposalViewSet,
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'proposals', ProposalViewSet, basename='proposal')
router.register(r'profiles', ProfileViewSet, basename='profile')  # optional unified profile endpoint

urlpatterns = [
    path('test/', test_view, name='test'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Individual profile endpoints
    path('client-profile/', ClientProfileView.as_view(), name='client-profile'),
    path('freelancer-profile/', FreelancerProfileView.as_view(), name='freelancer-profile'),

    # Router endpoints
    path('', include(router.urls)),
]
