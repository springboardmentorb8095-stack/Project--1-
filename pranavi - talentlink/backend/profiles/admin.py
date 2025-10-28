from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Profile, Skill

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'hourly_rate', 'location', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'location']

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
