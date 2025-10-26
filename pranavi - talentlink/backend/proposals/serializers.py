from rest_framework import serializers
from .models import Proposal

class ProposalSerializer(serializers.ModelSerializer):
    freelancer_username = serializers.CharField(source='freelancer.username', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = Proposal
        fields = ['id', 'project', 'project_title', 'freelancer', 'freelancer_username',
                  'cover_letter', 'proposed_amount', 'delivery_time', 'status', 
                  'created_at', 'updated_at']
        read_only_fields = ['freelancer', 'created_at', 'updated_at']
