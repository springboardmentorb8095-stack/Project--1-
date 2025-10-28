from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContractViewSet, MilestoneViewSet, MessageViewSet, ReviewViewSet, NotificationViewSet

router = DefaultRouter()
router.register('contracts', ContractViewSet)
router.register('milestones', MilestoneViewSet)
router.register('messages', MessageViewSet)
router.register('reviews', ReviewViewSet)
router.register('notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
