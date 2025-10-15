from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import ClientProfile, FreelancerProfile, Project, Proposal, User
from .serializers import (
    RegisterSerializer,
    ClientProfileSerializer,
    FreelancerProfileSerializer,
    ProjectSerializer,
    ProposalSerializer,
    UserSerializer,
)

# ---------- Test View ----------
def test_view(request):
    return HttpResponse("Accounts app is working!")

# ---------- Register View ----------
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]  # <-- important

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------- Profile APIView (for logged-in user) ----------
class ClientProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClientProfileSerializer

    def get_object(self):
        # Safely get the profile or return None
        profile, created = ClientProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "company_name": self.request.user.username,
                "bio": "",
                "contact_email": self.request.user.email,
            }
        )
        return profile

class FreelancerProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FreelancerProfileSerializer

    def get_object(self):
        # Safely get the profile or create default
        profile, created = FreelancerProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "portfolio": "",
                "skills": "",
                "hourly_rate": 0.0,
                "availability": True,
            }
        )
        return profile

# ---------- Profile ViewSet (optional unified endpoint) ----------
class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        user = self.request.user
        if user.is_client:
            return ClientProfileSerializer
        elif user.is_freelancer:
            return FreelancerProfileSerializer
        return None

    def get_queryset(self):
        user = self.request.user
        if user.is_client:
            return ClientProfile.objects.filter(user=user)
        elif user.is_freelancer:
            return FreelancerProfile.objects.filter(user=user)
        return None

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ---------- Project ViewSet ----------
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Search + Filter
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'category']
    filterset_fields = ['category', 'budget', 'duration']

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

# ---------- Proposal ViewSet ----------
class ProposalViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'project']

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)
