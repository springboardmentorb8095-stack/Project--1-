# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from .models import ProfileClient, ProfileFreelancer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
<<<<<<< HEAD
        fields = ("id", "user", "bio", "location", "skills", "created_at")
        read_only_fields = ("id", "user", "created_at")

class ProfileClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileClient
        fields = ['id', 'user', 'contact', 'business_name', 'bio']

class ProfileFreelancerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileFreelancer
        fields = ['id', 'user', 'contact', 'skills', 'hourly_rate', 'available']
=======
        fields = (
            "id",
            "user",
            "role",
            "portfolio",
            "skills",
            "hourly_rate",
            "availability",
        )
>>>>>>> cad77ed10b3d6ee548919fe3a9a44c51d76a74e8
