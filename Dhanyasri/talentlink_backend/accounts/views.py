from django.http import HttpResponse
from rest_framework import generics, viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    ClientProfile,
    FreelancerProfile,
    Project,
    Proposal,
    Contract,
    Message,
    Notification
)
from .serializers import (
    RegisterSerializer,
    ClientProfileSerializer,
    FreelancerProfileSerializer,
    ProjectSerializer,
    ProposalSerializer,
    ContractSerializer,
    MessageSerializer,
    NotificationSerializer
)

# ✅ Helper function to create notifications
def create_notification(user, message, link=""):
    """
    Creates a notification entry for a specific user.
    """
    Notification.objects.create(user=user, message=message, link=link)

# ---------- Test View ----------
def test_view(request):
    return HttpResponse("Accounts app is working!")


# ---------- Authentication ----------
class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


# ---------- Client Profile ----------
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


# ---------- Freelancer Profile ----------
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


# ---------- Freelancer List ----------
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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'budget', 'duration']
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "is_client") and user.is_client:
            return Project.objects.filter(client=user).prefetch_related('proposals')
        elif hasattr(user, "is_freelancer") and user.is_freelancer:
            return Project.objects.all().prefetch_related('proposals')
        return Project.objects.none()

    def perform_create(self, serializer):
        project = serializer.save(client=self.request.user)
        create_notification(
            user=self.request.user,
            message=f"Your project '{project.title}' has been successfully posted!",
            link=f"/projects/{project.id}/"
        )


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
        proposal = serializer.save(freelancer=self.request.user)
        # Notify client when a freelancer submits a proposal
        create_notification(
            user=proposal.project.client,
            message=f"New proposal submitted for your project '{proposal.project.title}'.",
            link=f"/projects/{proposal.project.id}/"
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        proposal = self.get_object()
        if proposal.project.client != request.user:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        if proposal.status != "Pending":
            return Response({"error": "Proposal not pending"}, status=status.HTTP_400_BAD_REQUEST)

        proposal.status = "Accepted"
        proposal.save()

        # Create or fetch a contract
        contract, _ = Contract.objects.get_or_create(
            proposal=proposal,
            defaults={
                "client": proposal.project.client,
                "freelancer": proposal.freelancer,
                "payment_amount": proposal.bid_amount,
                "status": "Active"
            }
        )

        # Notify freelancer about acceptance
        create_notification(
            user=proposal.freelancer,
            message=f"Your proposal for project '{proposal.project.title}' has been accepted!",
            link=f"/contracts/{contract.id}/"
        )

        return Response(
            {"message": "Proposal accepted", "contract_id": contract.id},
            status=status.HTTP_200_OK
        )


# ---------- Contract ViewSet ----------
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Contract, Notification
from .serializers import ContractSerializer


class ContractViewSet(viewsets.ModelViewSet):
    """
    Handles all CRUD operations for contracts
    """
    queryset = Contract.objects.all().order_by('-created_at')
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Clients see their own contracts,
        Freelancers see their own contracts.
        """
        user = self.request.user
        if getattr(user, "is_client", False):
            return Contract.objects.filter(client=user)
        elif getattr(user, "is_freelancer", False):
            return Contract.objects.filter(freelancer=user)
        return Contract.objects.none()

    # ✅ Mark a contract as completed
    @action(detail=True, methods=['put'], url_path='mark_completed')
    def mark_completed(self, request, pk=None):
        """
        Mark a contract as completed and notify the freelancer.
        """
        contract = get_object_or_404(Contract, pk=pk)

        if contract.status == 'Completed':
            return Response({'detail': 'Contract already completed.'}, status=status.HTTP_400_BAD_REQUEST)

        contract.status = 'Completed'
        contract.save()

        # ✅ Create notification for freelancer
        Notification.objects.create(
            user=contract.freelancer,
            message=f"🎉 Your contract for '{contract.proposal.project.title}' has been marked as completed!"
        )

        serializer = self.get_serializer(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ✅ New endpoint: Submit review & rating by client
    @action(detail=True, methods=['post'], url_path='submit_review')
    def submit_review(self, request, pk=None):
        """
        Allow client to submit a review and rating once contract is completed.
        """
        contract = get_object_or_404(Contract, pk=pk)

        # Only client can review
        if request.user != contract.client:
            return Response({"error": "Only the client can submit a review."},
                            status=status.HTTP_403_FORBIDDEN)

        # Contract must be completed
        if contract.status != "Completed":
            return Response({"error": "You can only review a completed contract."},
                            status=status.HTTP_400_BAD_REQUEST)

        rating = request.data.get("rating")
        review = request.data.get("review")

        # Validate rating
        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                raise ValueError
        except (TypeError, ValueError):
            return Response({"error": "Rating must be an integer between 1 and 5."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Save review
        contract.rating = rating
        contract.review = review
        contract.save()

        # ✅ Notify freelancer
        Notification.objects.create(
            user=contract.freelancer,
            message=f"⭐ You received a {rating}-star review from {contract.client.username}!"
        )

        return Response({"message": "Review submitted successfully ✅"})

# ---------- Message ViewSet ----------
class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(contract__client=user) | Message.objects.filter(contract__freelancer=user)

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        # Notify the recipient
        recipient = (
            message.contract.freelancer
            if message.sender == message.contract.client
            else message.contract.client
        )
        create_notification(
            user=recipient,
            message=f"New message in your contract chat for '{message.contract.proposal.project.title}'.",
            link=f"/contracts/{message.contract.id}/messages/"
        )


# ---------- Notification ViewSet ----------
class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for handling notifications for both clients and freelancers.
    Allows fetching unread/read notifications and marking them as read.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Fetch notifications for the currently authenticated user only.
        """
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=["get"])
    def unread(self, request):
        """
        Get all unread notifications for the logged-in user.
        """
        unread_notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(unread_notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def read(self, request):
        """
        Get all read notifications for the logged-in user.
        """
        read_notifications = self.get_queryset().filter(is_read=True)
        serializer = self.get_serializer(read_notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def mark_as_read(self, request, pk=None):
        """
        Mark a single notification as read.
        """
        try:
            notification = self.get_queryset().get(pk=pk)
            notification.is_read = True
            notification.save()
            return Response({"message": "Notification marked as read ✅"})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["post"])
    def mark_all_as_read(self, request):
        """
        Mark all notifications as read for the logged-in user.
        """
        updated_count = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"message": f"{updated_count} notifications marked as read ✅"})
