<<<<<<< HEAD
from django.urls import path
from .views import ProjectCreateView, ProjectListView, ProjectDetailView

urlpatterns = [
    path('', ProjectListView.as_view(), name='project-list'),
    path('create/', ProjectCreateView.as_view(), name='project-create'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
]
=======
from django.urls import path
from .views import ProjectCreateView, ProjectListView, ProjectDetailView

urlpatterns = [
    path('', ProjectListView.as_view(), name='project-list'),
    path('create/', ProjectCreateView.as_view(), name='project-create'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
]
>>>>>>> f18711127ba5adc97ca66a5a12f3af6a229eeb6e
