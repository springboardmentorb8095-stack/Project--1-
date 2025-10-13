from django.contrib import admin

# Register your models here.

from .models import Skill, Profile, Project, Proposal, Contract, Message, Review

admin.site.register(Skill)
admin.site.register(Profile)
admin.site.register(Project)
admin.site.register(Proposal)
admin.site.register(Contract)
admin.site.register(Message)
admin.site.register(Review)

