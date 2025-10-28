from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'status', 'budget_min', 'budget_max', 'created_at']
    list_filter = ['status', 'duration', 'created_at']
    search_fields = ['title', 'description', 'client__username']
    filter_horizontal = ['skills_required']
