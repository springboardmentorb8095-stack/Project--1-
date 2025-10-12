from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile, PortfolioItem, Project, Proposal, Skill

User = get_user_model()

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

# User Registration Serializer
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])  # hash password
        user.save()
        # auto-create profile
        Profile.objects.create(user=user, full_name=user.username)
        return user


# User Serializer (for logged-in user details)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')




class ProfileSerializer(serializers.ModelSerializer):
    # Read skills as nested objects for display
    skills = SkillSerializer(many=True, read_only=True)
    
    # Write skills with IDs (many=True) for updates
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Skill.objects.all(),
        source='skills'  # this tells DRF to update the `skills` field
    )

    class Meta:
        model = Profile
        fields = [
            "id", "user", "full_name", "bio", "skills", "skill_ids",
            "hourly_rate", "availability", "location"
        ]
        read_only_fields = ['user']

    def update(self, instance, validated_data):
        skills = validated_data.pop('skills', None)  # 'skills' comes from 'skill_ids' source
        instance = super().update(instance, validated_data)
        if skills is not None:
            instance.skills.set(skills)  # set the many-to-many field properly
        instance.save()
        return instance


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ["id", "title", "description", "url", "added_on"]
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, Skill

User = get_user_model()

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    # Accept skill IDs (many=True) for create/update
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Skill.objects.all(),
        source='skills',
        required=False
    )

    # Return nested skill objects with id and name
    skills = SkillSerializer(many=True, read_only=True)

    # Show client ID (read-only)
    client = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'client', 'title', 'description', 'budget',
            'duration', 'skill_ids', 'skills', 'created_at'
        ]

    def create(self, validated_data):
    # Remove client if somehow present
        validated_data.pop('client', None)  

        request = self.context.get("request")
        skills = validated_data.pop("skills", [])
        
        # Use client from .save() call (in perform_create)
        client = self.context['request'].user  # just fallback (optional)

        project = Project.objects.create(
            **validated_data,
            client=client
        )
        project.skills.set(skills)
        return project


    def update(self, instance, validated_data):
        skills = validated_data.pop("skills", [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if skills is not None:
            instance.skills.set(skills)
        return instance



class ProposalSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.CharField(source='freelancer.username', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = Proposal
        fields = '__all__'
        read_only_fields = ['freelancer', 'status', 'created_at']

# serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add only user ID and role
        data['user'] = {
            "id": self.user.id,
            "role": self.user.role,
        }

        return data
