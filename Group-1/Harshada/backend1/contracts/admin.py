from django.contrib import admin
from .models import Contract

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('get_project', 'client', 'freelancer', 'bid_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('proposal__project__title', 'client__username', 'freelancer__username')

    def get_project(self, obj):
        return obj.proposal.project.title if obj.proposal else "-"
    get_project.short_description = "Project"
