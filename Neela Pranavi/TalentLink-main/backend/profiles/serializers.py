
from rest_framework import serializers
from .models import Profile, Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class ProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    user_info = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'bio', 'hourly_rate', 'location', 'portfolio_url',
            'phone', 'skills', 'skill_ids', 'availability', 'rating',
            'total_projects', 'user_info', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'rating', 'total_projects', 'created_at', 'updated_at']

    def get_user_info(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'user_type': obj.user.user_type
        }

    def update(self, instance, validated_data):
        skill_ids = validated_data.pop('skill_ids', None)
        instance = super().update(instance, validated_data)

        if skill_ids is not None:
            skills = Skill.objects.filter(id__in=skill_ids)
            instance.skills.set(skills)

        return instance
