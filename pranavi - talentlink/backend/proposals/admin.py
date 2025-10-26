from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Proposal

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ['project', 'freelancer', 'proposed_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['project__title', 'freelancer__username']
