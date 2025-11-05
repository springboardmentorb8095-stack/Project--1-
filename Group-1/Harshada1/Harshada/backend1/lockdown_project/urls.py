from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# ✅ Import your project views properly
from projects.views import (
    ProjectCreateView,
    ProjectListView,
    ProjectDetailView,
    ProjectSearchView,
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# ✅ Health check endpoint
def home(request):
    return JsonResponse({"message": "TalentLink Backend Running 🚀"})


urlpatterns = [
    # --- Django Admin ---
    path("admin/", admin.site.urls),

    # --- JWT Authentication ---
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # --- dj-rest-auth (login/logout/password reset) ---
    path("api/auth/", include("dj_rest_auth.urls")),

    # --- Registration (via allauth) ---
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),

    # --- Social Login (Google, GitHub, etc.) ---
    path("accounts/", include("allauth.urls")),

    # --- Health Check ---
    path("", home, name="home"),

    # --- Project Endpoints (directly from views) ---
    path("projects/create/", ProjectCreateView.as_view(), name="create_project"),
    path("projects/", ProjectListView.as_view(), name="project_list"),
    path("projects/<int:pk>/", ProjectDetailView.as_view(), name="project_detail"),
    path("projects/search/", ProjectSearchView.as_view(), name="project_search"),

    # --- Core App APIs ---
    path("api/users/", include("users.urls")),
    path("api/projects/", include("projects.urls")),
    path("api/proposals/", include("proposals.urls")),
    path("api/contracts/", include("contracts.urls")),
    path("api/messages/", include("messaging.urls")),
    path("api/notifications/", include("notification_review.urls")),
]
