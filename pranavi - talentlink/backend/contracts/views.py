from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Contract, Milestone, Message, Review
from .serializers import ContractSerializer, MilestoneSerializer, MessageSerializer, ReviewSerializer

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(client=user) | Contract.objects.filter(freelancer=user)

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Milestone.objects.filter(
            contract__client=user
        ) | Milestone.objects.filter(
            contract__freelancer=user
        )

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        contract_id = self.request.query_params.get('contract')
        queryset = Message.objects.filter(
            contract__client=user
        ) | Message.objects.filter(
            contract__freelancer=user
        )
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Contract, Milestone, Message, Review, Notification
from .serializers import (ContractSerializer, MilestoneSerializer, 
                          MessageSerializer, ReviewSerializer, NotificationSerializer)

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(client=user) | Contract.objects.filter(freelancer=user)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages for a contract"""
        contract = self.get_object()
        messages = contract.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark contract as completed"""
        contract = self.get_object()
        if request.user != contract.client:
            return Response({'error': 'Only client can complete contract'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        contract.status = 'completed'
        contract.save()
        
        # Create notification
        Notification.objects.create(
            user=contract.freelancer,
            notification_type='contract_completed',
            title='Contract Completed',
            message=f'Contract for "{contract.project.title}" has been marked as completed',
            link=f'/contracts/{contract.id}'
        )
        
        return Response({'status': 'Contract marked as completed'})

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Milestone.objects.filter(
            contract__client=user
        ) | Milestone.objects.filter(
            contract__freelancer=user
        )
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Freelancer submits milestone for review"""
        milestone = self.get_object()
        if request.user != milestone.contract.freelancer:
            return Response({'error': 'Only freelancer can submit milestone'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        milestone.status = 'submitted'
        milestone.save()
        
        # Create notification for client
        Notification.objects.create(
            user=milestone.contract.client,
            notification_type='milestone_completed',
            title='Milestone Submitted',
            message=f'"{milestone.title}" has been submitted for review',
            link=f'/contracts/{milestone.contract.id}'
        )
        
        return Response({'status': 'Milestone submitted for review'})
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Client approves milestone"""
        milestone = self.get_object()
        if request.user != milestone.contract.client:
            return Response({'error': 'Only client can approve milestone'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        milestone.status = 'approved'
        milestone.completed_at = datetime.now()
        milestone.save()
        
        # Create notification for freelancer
        Notification.objects.create(
            user=milestone.contract.freelancer,
            notification_type='milestone_approved',
            title='Milestone Approved',
            message=f'"{milestone.title}" has been approved by client',
            link=f'/contracts/{milestone.contract.id}'
        )
        
        return Response({'status': 'Milestone approved'})

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        contract_id = self.request.query_params.get('contract')
        
        queryset = Message.objects.filter(
            contract__client=user
        ) | Message.objects.filter(
            contract__freelancer=user
        )
        
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)
        
        return queryset
    
    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        
        # Create notification for the receiver
        contract = message.contract
        receiver = contract.freelancer if message.sender == contract.client else contract.client
        
        Notification.objects.create(
            user=receiver,
            notification_type='new_message',
            title='New Message',
            message=f'You have a new message from {message.sender.username}',
            link=f'/contracts/{contract.id}'
        )
    
    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        """Mark messages as read"""
        message_ids = request.data.get('message_ids', [])
        Message.objects.filter(id__in=message_ids, contract__client=request.user).update(is_read=True)
        Message.objects.filter(id__in=message_ids, contract__freelancer=request.user).update(is_read=True)
        return Response({'status': 'Messages marked as read'})

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count})
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'All notifications marked as read'})

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    def perform_create(self, serializer):
        review = serializer.save(reviewer=self.request.user)
        
        # Create notification
        Notification.objects.create(
            user=review.reviewee,
            notification_type='review_received',
            title='New Review',
            message=f'{review.reviewer.username} left you a {review.rating}-star review',
            link=f'/profile/{review.reviewee.id}'
        )
