from django.contrib import admin
from .models import Profile, Skill, Item, Project, Proposal, Contract, Message, Review


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'email', 'is_client', 'is_freelancer')
    list_filter = ('is_client', 'is_freelancer')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'profile', 'level')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner', 'budget', 'duration')
    list_filter = ('duration',)


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'freelancer', 'price', 'status')
    list_filter = ('status',)


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('id', 'proposal', 'start_date', 'end_date', 'terms')
    list_filter = ('start_date',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'contract', 'sender', 'content', 'timestamp')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'reviewer', 'reviewee', 'project', 'rating')
