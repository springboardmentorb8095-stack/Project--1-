from django.contrib import admin
from .models import User, ClientProfile, FreelancerProfile, Project, Proposal

# Register User model
admin.site.register(User)

# Register profile models
admin.site.register(ClientProfile)
admin.site.register(FreelancerProfile)

# Register other models
admin.site.register(Project)
admin.site.register(Proposal)
