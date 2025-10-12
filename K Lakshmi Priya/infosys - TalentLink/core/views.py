from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets, filters
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer, UserSerializer, ProfileSerializer, PortfolioItemSerializer, ProjectSerializer, ProposalSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from .models import Profile, PortfolioItem, Project, Proposal

User = get_user_model()

# User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

# Logged-in user profile
class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)
        self.perform_update(serializer)
        return Response(serializer.data)

class PortfolioItemViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PortfolioItem.objects.filter(profile__user=self.request.user)

    def perform_create(self, serializer):
        profile = self.request.user.profile
        serializer.save(profile=profile)

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['skills__name', 'title', 'budget', 'duration']
    filterset_fields = ['budget', 'duration', 'skills__name']


    
    def get_queryset(self):
        return Project.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'client':
            raise PermissionDenied("Only clients can create projects.")
        serializer.save(client=user)

    def perform_update(self, serializer):
        user = self.request.user
        project = self.get_object()
        if project.client != user:
            raise PermissionDenied("You can edit only your own projects.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if instance.client != user:
            raise PermissionDenied("You can delete only your own projects.")
        instance.delete()

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def proposals(self, request, pk=None):
        project = self.get_object()
        user = request.user
        if user != project.client:
            return Response({"detail": "Not authorized to view proposals for this project."}, status=403)
        proposals = project.proposals.all()
        serializer = ProposalSerializer(proposals, many=True)
        return Response(serializer.data)

class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'freelancer':
            return Proposal.objects.filter(freelancer=user)
        elif user.role == 'client':
            return Proposal.objects.filter(project__client=user)
        return Proposal.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'freelancer':
            raise PermissionDenied("Only freelancers can submit proposals.")

        project = serializer.validated_data.get('project')
        if Proposal.objects.filter(project=project, freelancer=user).exists():
            raise PermissionDenied("You have already submitted a proposal for this project.")

        serializer.save(freelancer=user)

    # PATCH endpoint for status update
    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        
        print("=== update_status called ===")
        print("User:", request.user)
        print("Is Authenticated:", request.user.is_authenticated)
        print("Auth header:", request.META.get('HTTP_AUTHORIZATION'))
        proposal = self.get_object()
        user = request.user

        if user.role != 'client' or proposal.project.client != user:
            return Response({"error": "You are not allowed to update this proposal."}, status=403)

        new_status = request.data.get("status")
        if new_status not in ["accepted", "rejected", "pending"]:
            return Response({"error": "Invalid status."}, status=400)

        proposal.status = new_status
        proposal.save()
        return Response(
            {"message": f"Proposal {new_status} successfully."},
            status=status.HTTP_200_OK
        )


from rest_framework import viewsets, permissions, filters
from .models import Skill
from .serializers import SkillSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

# views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
