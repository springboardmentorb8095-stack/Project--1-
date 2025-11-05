from rest_framework import serializers
from .models import Profile, Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class ProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Skill.objects.all(), source='skills'
    )
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'username', 'bio', 'skills', 'skill_ids', 
                  'hourly_rate', 'portfolio_url', 'phone', 'location', 
                  'avatar', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
