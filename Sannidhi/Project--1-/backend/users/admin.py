# users/admin.py
from django.contrib import admin
from .models import Profile, ProfileClient, ProfileFreelancer

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'hourly_rate', 'availability')
    search_fields = ('user__username', 'role', 'skills')

@admin.register(ProfileClient)
class ProfileClientAdmin(admin.ModelAdmin):
    list_display = ('user', 'contact', 'business_name')
    search_fields = ('user__username', 'business_name')

@admin.register(ProfileFreelancer)
class ProfileFreelancerAdmin(admin.ModelAdmin):
    list_display = ('user', 'contact', 'skills', 'hourly_rate', 'available')
    search_fields = ('user__username', 'skills')
