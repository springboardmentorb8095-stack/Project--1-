# backend/messaging/admin.py
from django.contrib import admin
from .models import Message, Conversation

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'sender', 'receiver', 'timestamp', 'is_read')
    list_filter = ('is_read', 'timestamp', 'sender', 'receiver')
    search_fields = ('sender__username', 'receiver__username', 'content')

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at')
    filter_horizontal = ('participants',)
