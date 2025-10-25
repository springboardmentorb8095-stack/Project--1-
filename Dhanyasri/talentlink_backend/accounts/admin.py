from django.contrib import admin
from .models import User, ClientProfile, FreelancerProfile, Project, Proposal, Contract, Message

admin.site.register(User)
admin.site.register(ClientProfile)
admin.site.register(FreelancerProfile)
admin.site.register(Project)
admin.site.register(Proposal)
admin.site.register(Contract)
admin.site.register(Message)
