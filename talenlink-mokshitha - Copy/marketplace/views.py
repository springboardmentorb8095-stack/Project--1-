from rest_framework import viewsets, filters, status, serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend

from .models import Profile, Skill, Item, Project, Proposal, Contract, Message, Review
from .serializers import (
    ProfileSerializer, SkillSerializer, ItemSerializer,
    ProjectSerializer, ProposalSerializer, ContractSerializer,
    MessageSerializer, ReviewSerializer
)

# -------- Profile --------
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


# -------- Skill --------
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


# -------- Item --------
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


# -------- Project --------
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["budget", "duration"]
    search_fields = ["title", "description", "skills_required__name"]
    ordering_fields = ["budget", "duration"]


# -------- Proposal --------
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class ProposalViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        proposal = self.get_object()
        proposal.status = "accepted"
        proposal.save()
        return Response({"message": f"✅ Proposal from {proposal.freelancer.user_name} accepted for {proposal.project.title}"})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        proposal = self.get_object()
        proposal.status = "rejected"
        proposal.save()
        return Response({"message": f"❌ Proposal from {proposal.freelancer.user_name} rejected for {proposal.project.title}"})



# -------- Contract --------
class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


# -------- Message --------
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


# -------- Review --------
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


# -------- Authentication --------
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if Profile.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    profile = Profile.objects.create(user_name=username, email=email)

    return Response(
        {"message": "User registered successfully ✅", "id": profile.id, "username": username, "email": email},
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({"refresh": str(refresh), "access": str(refresh.access_token)})
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def set_user_role(request):
    username = request.data.get("username")
    role = request.data.get("role")

    if not username or not role:
        return Response({"error": "Username and role are required."}, status=400)

    try:
        profile = Profile.objects.get(user_name=username)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found."}, status=404)

    # ✅ Allow role set only once
    if not profile.is_client and not profile.is_freelancer:
        if role == "client":
            profile.is_client = True
        elif role == "freelancer":
            profile.is_freelancer = True
        else:
            return Response({"error": "Invalid role."}, status=400)

        profile.save(update_fields=["is_client", "is_freelancer"])
        return Response({"message": f"Role '{role}' saved successfully!"}, status=200)

    return Response({"error": "Role already assigned!"}, status=403)
