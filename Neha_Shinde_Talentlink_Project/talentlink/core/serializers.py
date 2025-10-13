from rest_framework import serializers
from .models import Skill, Profile, Project, Proposal, Contract, Message, Review
from django.contrib.auth.models import User

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    skills = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), many=True)

    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'role',
            'bio',
            'portfolio',       # ✅ Newly added field
            'hourly_rate',
            'availability',
            'skills',
        ]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['client', 'created_at', 'updated_at']

class ProposalSerializer(serializers.ModelSerializer):
    proposed_rate = serializers.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        model = Proposal
        fields = '__all__'
        read_only_fields = ['freelancer', 'submitted_at']


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class BudgetSerializer(serializers.Serializer):
    minIncome = serializers.IntegerField()
    maxIncome = serializers.IntegerField()
    budget = serializers.IntegerField()

    def validate(self, data):
        if data['minIncome'] > data['maxIncome']:
            raise serializers.ValidationError("minIncome cannot be greater than maxIncome")
        return data
