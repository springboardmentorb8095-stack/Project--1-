from django.urls import path
from .views import ProjectCreateView, ProjectListView, ProjectDetailView, ProjectSearchView

urlpatterns = [
    path('', ProjectListView.as_view(), name='project-list'),
    path('create/', ProjectCreateView.as_view(), name='project-create'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('search/', ProjectSearchView.as_view(), name='project-search'),  # ✅ Search route
]
