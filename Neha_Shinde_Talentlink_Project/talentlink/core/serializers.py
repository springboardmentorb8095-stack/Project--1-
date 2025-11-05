from rest_framework import serializers
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from .models import Skill, Profile, Project, Proposal, Contract, Message, Review, Notification
from django.contrib.auth.models import User

# 🔹 Skill
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

# profile
class ProfileSerializer(serializers.ModelSerializer):
    skills = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), many=True)
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'role',
            'bio',
            'portfolio',
            'hourly_rate',
            'availability',
            'skills',
        ]
        read_only_fields = ['id', 'user']

    def validate_portfolio(self, value):
        validator = URLValidator()
        try:
            validator(value)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid portfolio URL.")
        return value

# 🔹 Project
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['client', 'created_at', 'updated_at']

# 🔹 Proposal
class ProposalSerializer(serializers.ModelSerializer):
    proposed_rate = serializers.DecimalField(max_digits=8, decimal_places=2)
    freelancer_profile = serializers.PrimaryKeyRelatedField(source='freelancer', read_only=True)

    class Meta:
        model = Proposal
        fields = '__all__'
        read_only_fields = ['freelancer', 'submitted_at']

# 🔹 Contract
class ContractSerializer(serializers.ModelSerializer):
    client = serializers.CharField(source='client.user.username', read_only=True)
    freelancer = serializers.CharField(source='freelancer.user.username', read_only=True)
    project_title = serializers.CharField(source='proposal.project.title', read_only=True)

    class Meta:
        model = Contract
        fields = [
            'id', 'proposal', 'client', 'freelancer', 'status',
            'start_date', 'end_date', 'terms', 'project_title'
        ]


# 🔹 Message
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'conversation', 'content', 'timestamp', 'read']
        read_only_fields = ['id', 'sender', 'timestamp']



# 🔹 Review
class ReviewSerializer(serializers.ModelSerializer):
    reviewed = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['reviewer', 'created_at']



# 🔹 Budget
class BudgetSerializer(serializers.Serializer):
    minIncome = serializers.IntegerField()
    maxIncome = serializers.IntegerField()
    budget = serializers.IntegerField()

    def validate(self, data):
        if data['minIncome'] > data['maxIncome']:
            raise serializers.ValidationError("minIncome cannot be greater than maxIncome")
        return data

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'