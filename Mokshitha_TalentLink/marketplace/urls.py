from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet, SkillViewSet, ItemViewSet,
    ProjectViewSet, ProposalViewSet, ContractViewSet,
    MessageViewSet, ReviewViewSet,
    register_user, set_user_role, login_user
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'items', ItemViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'proposals', ProposalViewSet)
router.register(r'contracts', ContractViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name="register"),


    path('login/', login_user, name="login"),
    path('set-role/', set_user_role, name="set_role"),  # ✅ important
]
