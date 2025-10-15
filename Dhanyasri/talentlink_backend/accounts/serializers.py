from rest_framework import serializers
from .models import ClientProfile, FreelancerProfile, Project, Proposal, User

from django.contrib.auth.password_validation import validate_password

# ---------- Register Serializer ----------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'is_client', 'is_freelancer')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn’t match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            is_client=validated_data.get('is_client', False),
            is_freelancer=validated_data.get('is_freelancer', False)
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


# ---------- User Serializer ----------
class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
# ---------- Profile Serializer ----------
class ClientProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ClientProfile
        fields = ['id', 'user', 'company_name', 'bio', 'contact_email']

class FreelancerProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FreelancerProfile
        fields = ['id', 'user', 'portfolio', 'skills', 'hourly_rate', 'availability']
        
# ---------- Project Serializer ----------
class ProposalSerializer(serializers.ModelSerializer):
    freelancer = UserSerializer(read_only=True)  # auto-set on creation
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), write_only=True)  # allow project ID on creation

    class Meta:
        model = Proposal
        fields = ['id', 'project', 'freelancer', 'proposal_text', 'bid_amount', 'status', 'created_at']
        read_only_fields = ['freelancer', 'status', 'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    proposals = ProposalSerializer(many=True, read_only=True)  # nested proposals

    class Meta:
        model = Project
        fields = ['id', 'client', 'title', 'description', 'category', 'budget', 'duration', 'created_at', 'updated_at', 'proposals']
