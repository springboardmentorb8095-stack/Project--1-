from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):
    return HttpResponse("TalentLink Backend is running!")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('', home),  # root path
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
