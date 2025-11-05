from rest_framework import serializers
from .models import Project
from profiles.models import Skill
from profiles.serializers import SkillSerializer

class ProjectSerializer(serializers.ModelSerializer):
    skills_required = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        write_only=True, 
        queryset=Skill.objects.all(), 
        source='skills_required'
    )
    client_username = serializers.CharField(source='client.username', read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'client', 'client_username', 'title', 'description', 
                  'skills_required', 'skill_ids', 'budget_min', 'budget_max', 
                  'duration', 'status', 'deadline', 'created_at', 'updated_at']
        read_only_fields = ['client', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Extract skills_required from validated_data
        skills_data = validated_data.pop('skills_required', [])
        
        # Create the project (client is already in validated_data from perform_create)
        project = Project.objects.create(**validated_data)
        
        # Add skills to the project
        if skills_data:
            project.skills_required.set(skills_data)
        
        return project
