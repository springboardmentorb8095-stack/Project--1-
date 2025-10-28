from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Contract, Milestone, Message, Review, Notification

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['project', 'client', 'freelancer', 'status', 'total_amount']
    list_filter = ['status', 'created_at']

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'contract', 'amount', 'status', 'due_date']
    list_filter = ['status']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['contract', 'sender', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__username', 'content']
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_type', 'title', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['reviewer', 'reviewee', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
