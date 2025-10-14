from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


# ✅ Create a simple home endpoint
def home(request):
    return JsonResponse({
        "message": "Welcome to TalentLink API 🚀",
        "available_endpoints": [
            "/admin/",
            "/api/register/",
            "/api/login/",
            "/api/set-role/",
            "/api/profiles/",
            "/api/projects/",
        ]
    })


urlpatterns = [
    path('', home),  # ✅ Root route (this fixes the 404)
    path('admin/', admin.site.urls),
    path('api/', include('marketplace.urls')),
]
