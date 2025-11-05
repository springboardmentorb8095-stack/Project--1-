# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, ProfileClient, ProfileFreelancer


# 👤 Register Serializer (Signup)
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
        fields = ["id", "username", "email"]


# 👤 General Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "role",
            "portfolio",
            "skills",
            "hourly_rate",
            "availability",
        ]
        read_only_fields = ["id", "user"]


# 🧑‍💼 Client Profile Serializer
class ProfileClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProfileClient
        fields = ["id", "user", "contact", "business_name", "bio"]
        read_only_fields = ["id", "user"]


# 🧑‍💻 Freelancer Profile Serializer
class ProfileFreelancerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProfileFreelancer
        fields = ["id", "user", "contact", "skills", "hourly_rate", "available"]
        read_only_fields = ["id", "user"]
