from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, SkillViewSet

router = DefaultRouter()
router.register('profiles', ProfileViewSet)
router.register('skills', SkillViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
