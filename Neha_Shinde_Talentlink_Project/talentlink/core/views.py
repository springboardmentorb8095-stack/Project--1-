from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.db.models import Q


from rest_framework import viewsets
from .models import Skill, Profile, Project, Proposal, Contract, Message, Review
from .serializers import (
    SkillSerializer, ProfileSerializer, ProjectSerializer,
    ProposalSerializer, ContractSerializer, MessageSerializer, ReviewSerializer
)

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
       user = self.request.user
       if Profile.objects.filter(user=user).exists():
        raise serializers.ValidationError("Profile already exists for this user.")
       serializer.save(user=user)


    def create(self, request, *args, **kwargs):
        print("Incoming data:", request.data)
        return super().create(request, *args, **kwargs)
    
    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        queryset = Project.objects.all()
        skill = self.request.query_params.get('skill')
        budget_min = self.request.query_params.get('budget_min')
        budget_max = self.request.query_params.get('budget_max')
        duration_max = self.request.query_params.get('duration_max')

        if skill:
            queryset = queryset.filter(skills_required__name__icontains=skill)

        if budget_min:
            queryset = queryset.filter(budget__gte=budget_min)

        if budget_max:
            queryset = queryset.filter(budget__lte=budget_max)

        if duration_max:
            queryset = queryset.filter(duration_weeks__lte=duration_max)

        return queryset.distinct()
    
    def perform_create(self, serializer):
       try:
        profile = Profile.objects.get(user=self.request.user)
        print("Creating project for:", profile)
        serializer.save(client=profile)
       except Profile.DoesNotExist:
        print("No profile found for user:", self.request.user)
        raise serializers.ValidationError("Client profile not found.")
       except Exception as e:
        print("Unexpected error during project creation:", e)
        raise

class ProposalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProposalSerializer
    queryset = Proposal.objects.all()

    def perform_create(self, serializer):
        try:
            profile = Profile.objects.get(user=self.request.user)
            print("Profile found:", profile)
            serializer.save(freelancer=profile)
        except Profile.DoesNotExist:
            print("No profile found for user:", self.request.user)
            raise serializers.ValidationError("Freelancer profile not found.")

    def get_queryset(self):
        try:
            profile = Profile.objects.get(user=self.request.user)
            print(f"Fetching proposals for role: {profile.role}")
            if profile.role == 'client':
                return Proposal.objects.filter(project__client=profile)
            elif profile.role == 'freelancer':
                return Proposal.objects.filter(freelancer=profile)
            else:
                return Proposal.objects.none()
        except Profile.DoesNotExist:
            print("No profile found for user:", self.request.user)
            return Proposal.objects.none()

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

# ✅ Registration view with public access
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def budget_view(request):
    serializer = BudgetSerializer(data=request.data)
    if serializer.is_valid():
        # You can process or return filtered projects here
        return Response({'message': 'Budget data is valid'}, status=200)
    return Response(serializer.errors, status=400)
