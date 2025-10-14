
from django.contrib import admin
from .models import Profile, Skill

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'hourly_rate', 'location', 'availability', 'rating', 'total_projects']
    list_filter = ['availability', 'user__user_type', 'created_at']
    search_fields = ['user__username', 'user__email', 'location']
    filter_horizontal = ['skills']
