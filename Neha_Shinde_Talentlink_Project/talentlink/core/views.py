from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, viewsets, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.utils import timezone

from .models import Skill, Profile, Project, Proposal, Contract, Message, Review, Conversation, Notification
from .serializers import (
    SkillSerializer, ProfileSerializer, ProjectSerializer,
    ProposalSerializer, ContractSerializer, MessageSerializer,
    ReviewSerializer, BudgetSerializer, NotificationSerializer
)

# 🔹 Skill ViewSet
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

# 🔹 Profile ViewSet
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        if Profile.objects.filter(user=user).exists():
            raise serializers.ValidationError("Profile already exists for this user.")
        serializer.save(user=user)

    def create(self, request, *args, **kwargs):
        print("Incoming data:", request.data)
        print("Authenticated user:", request.user)
        return super().create(request, *args, **kwargs)

# 🔹 Project ViewSet
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
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
            raise serializers.ValidationError("Client profile not found.")


class ProposalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProposalSerializer
    queryset = Proposal.objects.all()

    def perform_create(self, serializer):
        try:
            profile = Profile.objects.get(user=self.request.user)
            serializer.save(freelancer=profile)
        except Profile.DoesNotExist:
            raise serializers.ValidationError("Freelancer profile not found.")

    def get_queryset(self):
        try:
            profile = Profile.objects.get(user=self.request.user)
            if profile.role == 'client':
                return Proposal.objects.filter(project__client=profile)
            elif profile.role == 'freelancer':
                return Proposal.objects.filter(freelancer=profile)
            return Proposal.objects.none()
        except Profile.DoesNotExist:
            return Proposal.objects.none()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        old_status = instance.status
        new_status = serializer.validated_data.get('status', old_status)

        serializer.save()

        # ✅ Auto-create contract if status becomes 'accepted'
        if old_status != 'accepted' and new_status == 'accepted':
            Contract.objects.get_or_create(
                proposal=instance,
                client=instance.project.client,
                freelancer=instance.freelancer,
                defaults={
                    'status': 'draft',
                    'start_date': timezone.now().date()
                }
            )

            # ✅ Create notification for freelancer
            Notification.objects.create(
                user=instance.freelancer.user,
                message=f"Your proposal for project '{instance.project.title}' was accepted."
            )

        return Response(serializer.data)



# 🔹 Contract ViewSet
class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            profile = Profile.objects.get(user=self.request.user)
            return Contract.objects.filter(Q(client=profile) | Q(freelancer=profile))
        except Profile.DoesNotExist:
            return Contract.objects.none()

    def create(self, request, *args, **kwargs):  # ✅ Use create instead of post
        proposal_id = request.data.get('proposal_id')
        try:
            proposal = Proposal.objects.get(id=proposal_id, status='accepted')
        except Proposal.DoesNotExist:
            return Response({'error': 'Proposal not found or not accepted'}, status=status.HTTP_404_NOT_FOUND)

        contract = Contract.objects.create(
           proposal=proposal,
           client=proposal.project.client,
           freelancer=proposal.freelancer,
           status='draft',
           start_date=timezone.now().date()  # ✅ Fix: provide required field
        )
        serializer = self.get_serializer(contract)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# 🔹 Message ViewSet
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
     serializer.save(sender=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(reviewer__user=self.request.user)

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(reviewer=profile)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all().values('id', 'username')
        return Response(users)


# 🔹 Public Registration Endpoint
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
    
class UpdateContractStatus(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, contract_id):
        new_status = request.data.get('status')
        if new_status not in ['draft', 'active', 'completed', 'cancelled']:
            return Response({'error': 'Invalid status'}, status=400)

        try:
            contract = Contract.objects.get(id=contract_id)
        except Contract.DoesNotExist:
            return Response({'error': 'Contract not found'}, status=404)

        contract.status = new_status
        contract.save()
        return Response({'status': contract.status})


class GetOrCreateConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        participant_id = request.data.get('participant_id')
        try:
            user1 = request.user
            user2 = User.objects.get(id=participant_id)
            convo = Conversation.objects.filter(participants=user1).filter(participants=user2).first()
            if not convo:
                convo = Conversation.objects.create()
                convo.participants.add(user1, user2)
            return Response({'id': convo.id})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class ConversationMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            convo = Conversation.objects.get(id=pk)
            if request.user not in convo.participants.all():
                return Response({'error': 'Unauthorized'}, status=403)
            messages = Message.objects.filter(conversation=convo).order_by('timestamp')
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=404)

class MarkMessagesReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            convo = Conversation.objects.get(id=pk)
            Message.objects.filter(conversation=convo, receiver=request.user, read=False).update(read=True)
            return Response({'status': 'Messages marked as read'})
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=404)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

# 🔹 Budget Filter Endpoint
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def budget_view(request):
    serializer = BudgetSerializer(data=request.data)
    if serializer.is_valid():
        return Response({'message': 'Budget data is valid'}, status=200)
    return Response(serializer.errors, status=400)
