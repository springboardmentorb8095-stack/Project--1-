from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user, budget_view, UserListView,
    UpdateContractStatus,
    SkillViewSet, ProfileViewSet, ProjectViewSet,
    ProposalViewSet, ContractViewSet, MessageViewSet, ReviewViewSet,
    GetOrCreateConversationView, ConversationMessagesView, MarkMessagesReadView, NotificationViewSet 
    # ✅ Add these
)

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'proposals', ProposalViewSet)
router.register(r'contracts', ContractViewSet, basename='contract')
router.register(r'messages', MessageViewSet)
router.register(r'reviews', ReviewViewSet, basename='reviews')
router.register(r'notifications', NotificationViewSet, basename='notifications')


urlpatterns = [
    path('', include(router.urls)),
    path('users/', UserListView.as_view(), name='user-list'),
    path('register/', register_user, name='register_user'),
    path('budget/', budget_view),
    path('contracts/<int:contract_id>/update-status/', UpdateContractStatus.as_view(), name='update-contract-status'),

    # 🔹 Messaging Endpoints
    path('conversations/get_or_create/', GetOrCreateConversationView.as_view(), name='get-or-create-conversation'),
    path('conversations/<int:pk>/messages/', ConversationMessagesView.as_view(), name='conversation-messages'),
    path('conversations/<int:pk>/mark_read/', MarkMessagesReadView.as_view(), name='mark-messages-read'),
]
