
from rest_framework import serializers
from profiles.serializers import SkillSerializer
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    skills_required = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    client_info = serializers.SerializerMethodField()
    proposal_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'client', 'client_info', 'skills_required',
            'skill_ids', 'budget_type', 'budget_min', 'budget_max', 'duration',
            'status', 'deadline', 'proposal_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['client', 'created_at', 'updated_at']

    def get_client_info(self, obj):
        return {
            'id': obj.client.id,
            'username': obj.client.username,
            'first_name': obj.client.first_name,
            'last_name': obj.client.last_name,
        }

    def get_proposal_count(self, obj):
        return obj.proposals.count()

    def create(self, validated_data):
        skill_ids = validated_data.pop('skill_ids', [])
        project = super().create(validated_data)

        if skill_ids:
            from profiles.models import Skill
            skills = Skill.objects.filter(id__in=skill_ids)
            project.skills_required.set(skills)

        return project

    def update(self, instance, validated_data):
        skill_ids = validated_data.pop('skill_ids', None)
        instance = super().update(instance, validated_data)

        if skill_ids is not None:
            from profiles.models import Skill
            skills = Skill.objects.filter(id__in=skill_ids)
            instance.skills_required.set(skills)

        return instance

class ProjectListSerializer(serializers.ModelSerializer):
    skills_required = SkillSerializer(many=True, read_only=True)
    client_info = serializers.SerializerMethodField()
    proposal_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'client_info', 'skills_required',
            'budget_type', 'budget_min', 'budget_max', 'duration', 'status',
            'proposal_count', 'created_at'
        ]

    def get_client_info(self, obj):
        return {
            'id': obj.client.id,
            'username': obj.client.username,
        }

    def get_proposal_count(self, obj):
        return obj.proposals.count()
