
from rest_framework import serializers
from .models import Proposal

class ProposalSerializer(serializers.ModelSerializer):
    freelancer_info = serializers.SerializerMethodField()
    project_info = serializers.SerializerMethodField()

    class Meta:
        model = Proposal
        fields = [
            'id', 'project', 'freelancer', 'freelancer_info', 'project_info',
            'cover_letter', 'proposed_budget', 'proposed_timeline', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['freelancer', 'created_at', 'updated_at']

    def get_freelancer_info(self, obj):
        profile = getattr(obj.freelancer, 'profile', None)
        return {
            'id': obj.freelancer.id,
            'username': obj.freelancer.username,
            'first_name': obj.freelancer.first_name,
            'last_name': obj.freelancer.last_name,
            'email': obj.freelancer.email,
            'rating': profile.rating if profile else 0.0,
            'total_projects': profile.total_projects if profile else 0,
        }

    def get_project_info(self, obj):
        return {
            'id': obj.project.id,
            'title': obj.project.title,
            'budget_type': obj.project.budget_type,
            'budget_min': obj.project.budget_min,
            'budget_max': obj.project.budget_max,
        }

class ProposalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ['project', 'cover_letter', 'proposed_budget', 'proposed_timeline']

    def validate(self, data):
        project = data['project']
        freelancer = self.context['request'].user

        # Check if freelancer already submitted a proposal for this project
        if Proposal.objects.filter(project=project, freelancer=freelancer).exists():
            raise serializers.ValidationError("You have already submitted a proposal for this project.")

        # Check if project is still open
        if project.status != 'open':
            raise serializers.ValidationError("This project is no longer accepting proposals.")

        # Check if user is a freelancer
        if freelancer.user_type != 'freelancer':
            raise serializers.ValidationError("Only freelancers can submit proposals.")

        # Check if freelancer is not the project owner
        if project.client == freelancer:
            raise serializers.ValidationError("You cannot submit a proposal for your own project.")

        return data

class ProposalStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ['status']

    def validate_status(self, value):
        if value not in ['accepted', 'rejected']:
            raise serializers.ValidationError("Status can only be updated to 'accepted' or 'rejected'.")
        return value
