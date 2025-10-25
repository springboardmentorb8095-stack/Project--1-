

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ContractViewSet, UserDetailView, ProfileView, PortfolioItemViewSet, ProjectViewSet, ProposalViewSet, SkillViewSet, CustomLoginView, PublicProfileView, PublicPortfolioView, NotificationViewSet, MessageViewSet


router = DefaultRouter()

router.register(r'portfolio', PortfolioItemViewSet, basename='portfolio')

router.register(r'projects', ProjectViewSet, basename='projects')

router.register(r'proposals', ProposalViewSet, basename='proposals')

router.register(r'skills', SkillViewSet, basename='skills')

router.register(r'contracts', ContractViewSet, basename='contract')

router.register(r'messages', MessageViewSet, basename="messages")

router.register(r'notifications', NotificationViewSet, basename='notification')


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    path('login/', CustomLoginView.as_view(), name='login'),
    path('users/<int:user_id>/profile/', PublicProfileView.as_view(), name='public-profile'),
    path('users/<int:user_id>/portfolio/', PublicPortfolioView.as_view(), name='public-portfolio'),



    path('', include(router.urls)),
]

