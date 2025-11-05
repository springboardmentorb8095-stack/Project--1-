from rest_framework import serializers
from .models import Profile, Skill, Item, Project, Proposal, Contract, Message, Review,Notification


# -------- Skill Serializer --------
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "level"]


# -------- Profile Serializer --------
class ProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    skill_names = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Profile
        fields = [
            "id",
            "user_name",
            "email",
            "bio",
            "portfolio",
            "hourly_rate",
            "availability",
            "is_client",
            "is_freelancer",
            "skills",
            "skill_names"
        ]

    def create(self, validated_data):
        skills = validated_data.pop("skill_names", [])
        profile = Profile.objects.create(**validated_data)
        for name in skills:
            Skill.objects.create(profile=profile, name=name.strip())
        return profile

    def update(self, instance, validated_data):
        skills = validated_data.pop("skill_names", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if skills is not None:
            instance.skills.all().delete()
            for name in skills:
                if name.strip():
                    Skill.objects.create(profile=instance, name=name.strip())
        return instance

# -------- Item Serializer --------
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


# -------- Project Serializer --------
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


# -------- Proposal Serializer --------
class ProposalSerializer(serializers.ModelSerializer):
    project_title = serializers.ReadOnlyField(source="project.title")
    freelancer_name = serializers.ReadOnlyField(source="freelancer.user_name")

    class Meta:
        model = Proposal
        fields = [
            "id",
            "project",
            "freelancer",
            "description",
            "price",
            "status",
            "project_title",
            "freelancer_name",
        ]


# -------- Contract Serializer --------
class ContractSerializer(serializers.ModelSerializer):
    project_title = serializers.ReadOnlyField(source="proposal.project.title")
    freelancer_name = serializers.ReadOnlyField(source="proposal.freelancer.user_name")
    client_name = serializers.ReadOnlyField(source="proposal.project.owner.user_name")

    class Meta:
        model = Contract
        fields = [
            "id", "proposal", "project_title",
            "freelancer_name", "client_name",
            "start_date", "end_date", "status", "terms"
        ]


# -------- Message Serializer --------
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


# -------- Review Serializer --------
class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.user_name', read_only=True)
    reviewee_name = serializers.CharField(source='reviewee.user_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'reviewee', 'project', 'rating', 'comment',
                  'reviewer_name', 'reviewee_name', 'project_title']

class NotificationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.user_name", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "user", "user_name", "message", "link", "is_read", "created_at"]

