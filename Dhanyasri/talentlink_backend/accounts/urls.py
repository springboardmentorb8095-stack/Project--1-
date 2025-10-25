from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    test_view, RegisterView, ClientProfileView, FreelancerProfileView,
    ProjectViewSet, ProposalViewSet, ContractViewSet, MessageViewSet,
    FreelancerListView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'proposals', ProposalViewSet, basename='proposals')
router.register(r'contracts', ContractViewSet, basename='contracts')
router.register(r'messages', MessageViewSet, basename='messages')

urlpatterns = [
    path('test/', test_view),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('client-profile/', ClientProfileView.as_view(), name='client-profile'),
    path('freelancer-profile/', FreelancerProfileView.as_view(), name='freelancer-profile'),
    path('profiles/', FreelancerListView.as_view(), name='freelancer-list'),  # Fix for FindFreelancers
    path('api/', include(router.urls)),
    path("", include(router.urls)),
]
