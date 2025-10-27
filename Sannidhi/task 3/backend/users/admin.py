from django.contrib import admin
from .models import Profile
from .models import ProfileClient, ProfileFreelancer

admin.site.register(Profile)
admin.site.register(ProfileFreelancer)
admin.site.register(ProfileClient)

# app_name/admin.py
from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "budget", "skills", "deadline", "status", "created_at")

