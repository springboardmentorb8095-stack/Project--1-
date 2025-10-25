from django.contrib import admin
from .models import Skill, Profile, Project, Proposal, Contract, Message, Review

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'role', 'hourly_rate', 'availability']
    list_filter = ['role', 'availability']
    search_fields = ['user__username', 'bio']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'client', 'budget', 'duration_weeks']
    list_filter = ['duration_weeks']
    search_fields = ['title', 'description']

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ['id', 'freelancer', 'project', 'created_at']  # ✅ Removed 'status'
    list_filter = ['project', 'freelancer']  # ✅ Removed 'status'
    search_fields = ['freelancer__user__username', 'project__title']

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['id', 'client', 'freelancer', 'start_date', 'end_date']  # ✅ Removed 'project'
    search_fields = ['client__user__username', 'freelancer__user__username']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'receiver', 'timestamp']
    search_fields = ['sender__user__username', 'receiver__user__username']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'reviewer', 'reviewed', 'rating']  # ✅ Replaced 'reviewee' with 'reviewed'
    list_filter = ['rating']
    search_fields = ['reviewer__user__username', 'reviewed__user__username']
