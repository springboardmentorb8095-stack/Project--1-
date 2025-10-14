
from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'budget_type', 'budget_min', 'budget_max', 'duration', 'status', 'created_at']
    list_filter = ['status', 'budget_type', 'duration', 'created_at']
    search_fields = ['title', 'description', 'client__username']
    filter_horizontal = ['skills_required']
    date_hierarchy = 'created_at'
