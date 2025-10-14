from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register_user
from .views import budget_view

from .views import (
    SkillViewSet, ProfileViewSet, ProjectViewSet,
    ProposalViewSet, ContractViewSet, MessageViewSet, ReviewViewSet,budget_view
)

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'proposals', ProposalViewSet)
router.register(r'contracts', ContractViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),  # ✅ This exposes /api/profiles/
    path('register/', register_user, name='register_user'),
    path('api/budget/', budget_view)
]
