from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    test_view,
    RegisterView,
    ClientProfileView,
    FreelancerProfileView,
    ProjectViewSet,
    ProposalViewSet,
    ContractViewSet,
    MessageViewSet,
    FreelancerListView,
    NotificationViewSet,  # ✅ newly added
)

# ---------- Router Setup ----------
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'proposals', ProposalViewSet, basename='proposals')
router.register(r'contracts', ContractViewSet, basename='contracts')
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'notifications', NotificationViewSet, basename='notifications')  # ✅ added

# ---------- URL Patterns ----------
urlpatterns = [
    # Health check / test route
    path('test/', test_view, name='test'),

    # Authentication routes
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile routes
    path('client-profile/', ClientProfileView.as_view(), name='client-profile'),
    path('freelancer-profile/', FreelancerProfileView.as_view(), name='freelancer-profile'),
    path('profiles/', FreelancerListView.as_view(), name='freelancer-list'),

    # Include all ViewSets (Projects, Proposals, Contracts, Messages, Notifications)
    path('', include(router.urls)),
]
