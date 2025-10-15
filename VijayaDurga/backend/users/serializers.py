# backend/users/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, ProfileClient

# ✅ Register serializer (handles user creation + role)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False, default="freelancer")

    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]

    def create(self, validated_data):
        role = validated_data.pop("role", "freelancer")
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, role=role)
        return user


# ✅ Profile Serializer (for Freelancer & Client shared fields)
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "email",
            "role",
            "skills",
            "availability",
            "hourly_rate",
        ]


# ✅ Client-specific profile serializer
class ProfileClientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = ProfileClient
        fields = [
            "id",
            "username",
            "email",
            "company_name",
            "company_description",
            "website",
            "location",
        ]
