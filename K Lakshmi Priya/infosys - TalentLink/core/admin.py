from django.contrib import admin

# Register your models here.
from .models import User, Profile, Project, Proposal, Contract, Message, Review, Skill, PortfolioItem, Notification


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "role", "is_staff", "is_active")
    search_fields = ("username", "email")
    list_filter = ("role", "is_staff", "is_active")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "full_name", "display_skills", "hourly_rate", "availability", "location")
    search_fields = ("full_name", "skills__name", "location")  # note the double underscore for m2m search
    list_filter = ("availability",)

    def display_skills(self, obj):
        return ", ".join(skill.name for skill in obj.skills.all())
    display_skills.short_description = "Skills"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "client", "title", "budget", "duration","status", "get_skills", "created_at", "updated_at")
    search_fields = ("title", "description", "skills__required")
    list_filter = ("created_at", "budget")
    def get_skills(self, obj):
        return ", ".join([str(skill) for skill in obj.skills.all()])
    get_skills.short_description = "Skills"


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "freelancer", "status", "proposed_rate", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("cover_letter",)


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("id", "proposal", "start_date", "end_date", "status")
    list_filter = ("status",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "sender", "receiver", "timestamp")
    search_fields = ("content",)
    list_filter = ("timestamp",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "contract", "reviewer", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("comment",)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)

@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ("id", "profile", "title", "url", "added_on")
    search_fields = ("title", "url", "profile__user__username")
    list_filter = ("added_on",)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "actor", "verb", "recipient", "notif_type", "unread", "timestamp")
    list_filter = ("notif_type", "unread", "timestamp")
    search_fields = ("verb", "target_type", "actor__username", "recipient__username")