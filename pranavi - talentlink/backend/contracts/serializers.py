from rest_framework import serializers
from .models import Contract, Milestone, Message, Review, Notification

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'contract', 'title', 'description', 'amount', 'due_date', 
                  'status', 'created_at', 'completed_at']

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'contract', 'sender', 'sender_username', 'content', 
                  'created_at', 'is_read']
        read_only_fields = ['sender']

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.CharField(source='reviewer.username', read_only=True)
    reviewee_username = serializers.CharField(source='reviewee.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'contract', 'reviewer', 'reviewer_username', 'reviewee', 
                  'reviewee_username', 'rating', 'comment', 'professionalism', 
                  'communication', 'quality', 'created_at']
        read_only_fields = ['reviewer']

class ContractSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)
    client_username = serializers.CharField(source='client.username', read_only=True)
    freelancer_username = serializers.CharField(source='freelancer.username', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = Contract
        fields = ['id', 'project', 'project_title', 'proposal', 'client', 
                  'client_username', 'freelancer', 'freelancer_username', 
                  'total_amount', 'status', 'start_date', 'end_date', 'terms', 
                  'milestones', 'created_at']


# Add these serializers

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    attachment_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'contract', 'sender', 'sender_id', 'sender_username', 
                  'content', 'attachment', 'attachment_url', 'created_at', 'is_read']
        read_only_fields = ['sender']
    
    def get_attachment_url(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return None

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'title', 'message', 
                  'link', 'is_read', 'created_at']
        read_only_fields = ['user']
