# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, ProfileClient, ProfileFreelancer, Project  # ✅ added Project model


# 👤 Register Serializer (for signup API)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


# 👤 Basic User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")


# 👤 General Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = (
            "id",
            "user",
            "skills",
            "role",
            "portfolio",
            "hourly_rate",
            "availability",
        )
        read_only_fields = ("id", "user")


# 🧑‍💼 Client Profile Serializer
class ProfileClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProfileClient
        fields = ["id", "user", "contact", "business_name", "bio"]


# 🧑‍💻 Freelancer Profile Serializer
class ProfileFreelancerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProfileFreelancer
        fields = ["id", "user", "contact", "skills", "hourly_rate", "available"]


# 🧩 Project Serializer (new)
class ProjectSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "client",
            "title",
            "budget",
            "skills",
            "deadline",
            "status",
            "description",
            "created_at",
        ]
        read_only_fields = ["id", "client", "created_at"]
