
from django.urls import path
from .views import ProfileCreateUpdateView, ProfileListView, SkillListCreateView, profile_detail

urlpatterns = [
    path('', ProfileListView.as_view(), name='profile-list'),
    path('me/', ProfileCreateUpdateView.as_view(), name='my-profile'),
    path('<int:user_id>/', profile_detail, name='profile-detail'),
    path('skills/', SkillListCreateView.as_view(), name='skills'),
]
