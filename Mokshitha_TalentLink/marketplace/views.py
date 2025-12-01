from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend

from .models import Profile, Skill, Item, Project, Proposal, Contract, Message, Review,Notification
from .serializers import (
    ProfileSerializer, SkillSerializer, ItemSerializer,
    ProjectSerializer, ProposalSerializer, ContractSerializer,
    MessageSerializer, ReviewSerializer,NotificationSerializer
)

# ---------------------- PROFILE ----------------------
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


# ---------------------- SKILL ----------------------
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


# ---------------------- ITEM ----------------------
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

# ---------------------- PROJECT ----------------------
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["budget", "duration"]
    search_fields = ["title", "description", "skills_required__name"]
    ordering_fields = ["budget", "duration"]

    # ✅ New: Notify freelancers when a client adds a project
    def perform_create(self, serializer):
        project = serializer.save()
        try:
            from .models import Profile, Notification
            freelancers = Profile.objects.filter(is_freelancer=True)
            for freelancer in freelancers:
                Notification.objects.create(
                    user=freelancer,
                    message=f"🆕 New project '{project.title}' has been added!",
                    link="/freelancer-dashboard",
                    is_read=False
                )
            print(f"✅ Notified {freelancers.count()} freelancers about project '{project.title}'")
        except Exception as e:
            print(f"⚠️ Error creating freelancer notifications: {e}")


# ---------------------- PROPOSAL ----------------------
class ProposalViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer

    # ✅ Auto-contract creation when accepted
    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == "accepted":
            from .models import Contract
            contract, created = Contract.objects.get_or_create(proposal=instance)
            if created:
                print(f"✅ Contract auto-created for proposal ID {instance.id}")

    # ✅ New: Notify client when a freelancer submits a proposal
    def perform_create(self, serializer):
        proposal = serializer.save()
        try:
            from .models import Notification
            client_profile = proposal.project.owner
            Notification.objects.create(
                user=client_profile,
                message=f"📨 New proposal received from {proposal.freelancer.user_name} for '{proposal.project.title}'",
                link="/client-dashboard",
                is_read=False
            )
            print(f"✅ Notified client {client_profile.user_name} about new proposal")
        except Exception as e:
            print(f"⚠️ Error creating client notification: {e}")

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        proposal = self.get_object()
        proposal.status = "accepted"
        proposal.save()
        from .models import Contract
        Contract.objects.get_or_create(proposal=proposal)
        return Response({
            "message": f"✅ Proposal from {proposal.freelancer.user_name} accepted for {proposal.project.title}"
        })

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        proposal = self.get_object()
        proposal.status = "rejected"
        proposal.save()
        return Response({
            "message": f"❌ Proposal from {proposal.freelancer.user_name} rejected for {proposal.project.title}"
        })

# ---------------------- CONTRACT ----------------------
class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


# ---------------------- MESSAGE ----------------------
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by("timestamp")
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        print("📩 Incoming Message Data:", request.data)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        message = serializer.save()
        try:
            receiver_profile = Profile.objects.get(user_name=message.receiver)
            Notification.objects.create(
                user=receiver_profile,
                message=f"💬 New message from {message.sender}",
                link=f"/chat/{message.contract.id}",
                is_read=False
            )
            print(f"✅ Notification created for {receiver_profile.user_name}")
        except Profile.DoesNotExist:
            print(f"⚠️ Receiver profile not found for: {message.receiver}")

        # Placeholder for email (optional)
        print(f"[EMAIL PLACEHOLDER] To {message.receiver}: You have a new message from {message.sender}")

# ---------------------- NOTIFICATION ----------------------
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    def get_queryset(self):
        user_name = self.request.query_params.get('user_name')
        if user_name:
            return Notification.objects.filter(user__user_name=user_name).order_by('-created_at')
        return super().get_queryset()


# ---------------------- REVIEW ----------------------
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-id')
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        review = serializer.save()
        print(f"⭐ Review added by {review.reviewer.user_name} for {review.reviewee.user_name}")

        # Notify reviewee
        try:
            from .models import Notification
            Notification.objects.create(
                user=review.reviewee,
                message=f"⭐ You received a {review.rating}-star review from {review.reviewer.user_name} on '{review.project.title}'",
                link=f"/freelancer-dashboard",
                is_read=False
            )
        except Exception as e:
            print(f"⚠️ Notification failed: {e}")



# ---------------------- AUTH ----------------------
@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

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


@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({"refresh": str(refresh), "access": str(refresh.access_token)})
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def set_user_role(request):
    username = request.data.get("username")
    role = request.data.get("role")

    if not username or not role:
        return Response({"error": "Username and role are required."}, status=400)

    try:
        profile = Profile.objects.get(user_name=username)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found."}, status=404)

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



