from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'client', 'client_name', 'title', 'description',
                  'skills_required', 'budget', 'duration', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'client']