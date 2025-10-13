
from django.contrib import admin
from .models import Proposal

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ['project', 'freelancer', 'proposed_budget', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'project__budget_type']
    search_fields = ['project__title', 'freelancer__username', 'cover_letter']
    date_hierarchy = 'created_at'
