
#views.py

from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets, filters
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer,ContractSerializer, UserSerializer, ProfileSerializer, PortfolioItemSerializer, ProjectSerializer, ProposalSerializer, MessageSerializer, NotificationSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Profile, PortfolioItem, Project, Proposal, Contract, Message, Notification
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from django.db.models import Q

from datetime import timedelta


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



class PublicProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]  # Anyone can view
    lookup_url_kwarg = "user_id"

    def get_queryset(self):
        return Profile.objects.select_related("user").prefetch_related("skills")

    def get_object(self):
        user_id = self.kwargs.get("user_id")
        return Profile.objects.get(user__id=user_id)

class PublicPortfolioView(generics.ListAPIView):
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.AllowAny]
    lookup_url_kwarg = "user_id"

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        return PortfolioItem.objects.filter(profile__user__id=user_id)


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
        proposal = self.get_object()
        user = request.user

        if user.role != 'client' or proposal.project.client != user:
            return Response({"error": "You are not allowed to update this proposal."}, status=403)

        new_status = request.data.get("status")
        if new_status not in ["accepted", "rejected", "pending"]:
            return Response({"error": "Invalid status."}, status=400)

        if new_status == "accepted":
            # 1. Mark this proposal as accepted
            proposal.status = "accepted"
            proposal.save()

            # 2. Reject other proposals for this project
            Proposal.objects.filter(project=proposal.project).exclude(id=proposal.id).update(status="rejected")

            # 3. Create contract if not already exists
            if not hasattr(proposal, 'contract'):
                Contract.objects.create(
                    proposal=proposal,
                    start_date=timezone.now(),
                    end_date=timezone.now() + timedelta(days=30),  # Temporary default duration
                    status='active'
                )

            Notification.objects.create(
            recipient=proposal.freelancer,
            actor=user,
            notif_type='proposal',
            verb='accepted your proposal',
            target_id=proposal.id,
            target_type='Proposal'
            )

            # 4. Mark project as in progress
            proposal.project.status = "closed"
            proposal.project.save()

            return Response({"message": "Proposal accepted, contract created, others rejected."})

        else:
            # For reject/pending
            proposal.status = new_status
            proposal.save()
            return Response({"message": f"Proposal {new_status} successfully."})



from rest_framework import viewsets, permissions, filters
from .models import Skill
from .serializers import SkillSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

# CustomLoginView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

#ContractViewSet
class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(
            proposal__freelancer=user
        ) | Contract.objects.filter(
            proposal__project__client=user
        )


    def perform_update(self, serializer):
        contract = self.get_object()
        new_status = serializer.validated_data.get('status')

        # Prevent changing status if already completed or cancelled
        if contract.status in ['completed', 'cancelled']:
            raise ValidationError("You cannot change the status of a completed or cancelled contract.")

        serializer.save()
        
        freelancer_user = contract.proposal.freelancer
        client_user = contract.proposal.project.client
        actor = self.request.user
        recipient = freelancer_user if actor == client_user else client_user

        try:
            Notification.objects.create(
                recipient=recipient,
                actor=actor,
                notif_type='contract',
                verb=f'marked the contract {new_status}',
                target_id=contract.id,
                target_type='Contract'
            )
            print("✅ Notification for contract created.")
        except Exception as e:
            print("❌ Notification creation failed:", e)



# messages
class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Show only messages involving the logged-in user
        user = self.request.user
        other_user_id = self.request.query_params.get("user_id")

        if other_user_id:
            return Message.objects.filter(
                Q(sender=user, receiver_id=other_user_id) |
                Q(sender_id=other_user_id, receiver=user)
            ).order_by("timestamp")
        return Message.objects.none()  # avoid listing everything

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)

        try:
            Notification.objects.create(
                recipient=message.receiver,
                actor=message.sender,
                notif_type='message',
                verb='sent you a message',
                target_id=message.id,
                target_type='Message'
            )
        except Exception as e:
            print("Notification error:", e)





    @action(detail=False, methods=["get"])
    def conversations(self, request):
        """
        Returns latest message per user the current user interacted with
        """
        user = request.user
        # All messages involving current user
        messages = Message.objects.filter(Q(sender=user) | Q(receiver=user))

        # Dictionary to store latest message per user pair
        convo_map = {}
        for msg in messages.order_by("-timestamp"):
            other = msg.receiver if msg.sender == user else msg.sender
            if other.id not in convo_map:
                convo_map[other.id] = {
                    "user_id": other.id,
                    "username": other.username,
                    "last_message": msg.content,
                    "timestamp": msg.timestamp,
                }

        return Response(list(convo_map.values()))

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-timestamp')

    def perform_update(self, serializer):
        # allow mark as read/unread
        # only recipient can update
        if serializer.instance.recipient != self.request.user:
            raise permissions.PermissionDenied("Cannot update notifications for other users.")
        serializer.save()
