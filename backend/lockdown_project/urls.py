from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Optional home route
from django.http import JsonResponse
def home(request):
    return JsonResponse({"message": "TalentLink Backend Running"})

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Home route
    path('', home, name='home'),

    # Users API
    path('api/users/', include('users.urls')),

    # Projects API
    path('api/projects/', include('projects.urls')),

    # Proposals API
    path('api/proposals/', include('proposals.urls')),

    # Contracts API
    path('api/contracts/', include('contracts.urls')),

    # Messaging API
    path('api/messages/', include('messaging.urls')),
]
