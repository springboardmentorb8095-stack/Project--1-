from django.http import HttpResponse
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    ClientProfile,
    FreelancerProfile,
    Project,
    Proposal,
    Contract,
    Message
)
from .serializers import (
    RegisterSerializer,
    ClientProfileSerializer,
    FreelancerProfileSerializer,
    ProjectSerializer,
    ProposalSerializer,
    ContractSerializer,
    MessageSerializer
)

# ---------- Test view ----------
def test_view(request):
    return HttpResponse("Accounts app is working!")

# ---------- Register ----------
class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

# ---------- Profile Views ----------
class ClientProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClientProfileSerializer

    def get_object(self):
        profile, _ = ClientProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "company_name": self.request.user.username,
                "bio": "",
                "contact_email": self.request.user.email
            }
        )
        return profile

class FreelancerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FreelancerProfileSerializer

    def get_object(self):
        profile, _ = FreelancerProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "portfolio": "",
                "skills": "",
                "hourly_rate": 0,
                "availability": True
            }
        )
        return profile

# ---------- Freelancer List View for FindFreelancers page ----------
class FreelancerListView(generics.ListAPIView):
    queryset = FreelancerProfile.objects.all()
    serializer_class = FreelancerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        skills = self.request.query_params.get("skills__icontains")
        min_rate = self.request.query_params.get("hourly_rate__gte")
        max_rate = self.request.query_params.get("hourly_rate__lte")
        availability = self.request.query_params.get("availability")

        if skills:
            queryset = queryset.filter(skills__icontains=skills)
        if min_rate:
            queryset = queryset.filter(hourly_rate__gte=min_rate)
        if max_rate:
            queryset = queryset.filter(hourly_rate__lte=max_rate)
        if availability in ["true", "false"]:
            queryset = queryset.filter(availability=(availability == "true"))

        return queryset

# ---------- Project ViewSet ----------
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'budget']

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "is_client") and user.is_client:
            return Project.objects.filter(client=user).prefetch_related('proposals')
        elif hasattr(user, "is_freelancer") and user.is_freelancer:
            return Project.objects.all().prefetch_related('proposals')
        return Project.objects.none()

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

# ---------- Proposal ViewSet ----------
class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'project']

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "is_client") and user.is_client:
            return Proposal.objects.filter(project__client=user)
        elif hasattr(user, "is_freelancer") and user.is_freelancer:
            return Proposal.objects.filter(freelancer=user)
        return Proposal.objects.none()

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        proposal = self.get_object()
        if proposal.project.client != request.user:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        if proposal.status != "Pending":
            return Response({"error": "Proposal not pending"}, status=status.HTTP_400_BAD_REQUEST)
        proposal.status = "Accepted"
        proposal.save()

        contract, _ = Contract.objects.get_or_create(
            proposal=proposal,
            defaults={
                "client": proposal.project.client,
                "freelancer": proposal.freelancer,
                "payment_amount": proposal.bid_amount,
                "status": "Active"
            }
        )
        return Response({"message": "Proposal accepted", "contract_id": contract.id}, status=status.HTTP_200_OK)

# ---------- Contract ViewSet ----------
class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'client', 'freelancer']

    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(client=user) | Contract.objects.filter(freelancer=user)

# ---------- Message ViewSet ----------
class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(contract__client=user) | Message.objects.filter(contract__freelancer=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
