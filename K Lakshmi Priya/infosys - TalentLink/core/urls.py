

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserDetailView, ProfileView, PortfolioItemViewSet, ProjectViewSet, ProposalViewSet, SkillViewSet, CustomLoginView

router = DefaultRouter()

router.register(r'portfolio', PortfolioItemViewSet, basename='portfolio')

router.register(r'projects', ProjectViewSet, basename='projects')

router.register(r'proposals', ProposalViewSet, basename='proposals')

router.register(r'skills', SkillViewSet, basename='skills')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    path('login/', CustomLoginView.as_view(), name='login'),


    path('', include(router.urls)),
]

