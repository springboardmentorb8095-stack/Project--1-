from django.contrib import admin
from .models import Project, Proposal, Profile  # import your models

# Register models to appear in admin
admin.site.register(Project)
admin.site.register(Proposal)
admin.site.register(Profile)
