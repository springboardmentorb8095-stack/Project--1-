from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import ClientProfile, FreelancerProfile, Project, Proposal, User, Contract, Message

# ---------- User Serializers ----------
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

# ---------- Profile Serializers ----------
class ClientProfileSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = ClientProfile
        fields = ['id', 'user', 'company_name', 'bio', 'contact_email']

class FreelancerProfileSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = FreelancerProfile
        fields = ['id', 'user', 'portfolio', 'skills', 'hourly_rate', 'availability']

# ---------- Project Serializer ----------
class ProjectSerializer(serializers.ModelSerializer):
    client = serializers.CharField(source='client.username', read_only=True)
    proposals = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'client', 'title', 'description', 'category', 'budget', 'duration', 'created_at', 'updated_at', 'proposals']

    def get_proposals(self, obj):
        from .serializers import ProposalSerializer
        proposals = obj.proposals.all()
        return ProposalSerializer(proposals, many=True).data

# ---------- Proposal Serializer ----------
class ProposalSerializer(serializers.ModelSerializer):
    freelancer = serializers.CharField(source='freelancer.username', read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), write_only=True)

    class Meta:
        model = Proposal
        fields = ['id', 'project', 'freelancer', 'proposal_text', 'bid_amount', 'status', 'created_at']
        read_only_fields = ['freelancer', 'status', 'created_at']


# ---------- Contract Serializer ----------
class ContractSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='proposal.project.title', read_only=True)
    freelancer = serializers.CharField(source='freelancer.username', read_only=True)
    client = serializers.CharField(source='client.username', read_only=True)

    class Meta:
        model = Contract
        fields = ['id', 'proposal', 'project_title', 'freelancer', 'client', 'payment_amount', 'status', 'created_at']

# ---------- Message Serializer ----------
class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username', read_only=True)
    class Meta:
        model = Message
        fields = ['id', 'contract', 'sender', 'text', 'timestamp']
        read_only_fields = ['id', 'sender', 'timestamp']
