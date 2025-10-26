from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Proposal
from .serializers import ProposalSerializer
from contracts.models import Contract, Milestone
from datetime import datetime, timedelta

class ProposalViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Proposal.objects.all()
        
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        if user.user_type == 'freelancer':
            queryset = queryset.filter(freelancer=user)
        elif user.user_type == 'client':
            queryset = queryset.filter(project__client=user)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        proposal = self.get_object()
        
        # Check if user is the project owner
        if request.user != proposal.project.client:
            return Response(
                {'error': 'Only project owner can accept proposals'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update proposal status
        proposal.status = 'accepted'
        proposal.save()
        
        # Update project status
        proposal.project.status = 'in_progress'
        proposal.project.save()
        
        # Create contract automatically
        contract = Contract.objects.create(
            project=proposal.project,
            proposal=proposal,
            client=proposal.project.client,
            freelancer=proposal.freelancer,
            total_amount=proposal.proposed_amount,
            status='active',
            terms=f"Contract for project: {proposal.project.title}\n\n"
                  f"Agreed amount: ${proposal.proposed_amount}\n"
                  f"Delivery time: {proposal.delivery_time} days\n\n"
                  f"Terms: Both parties agree to complete the work as described."
        )
        
        # Create default milestones (example: 3 milestones)
        milestone_amount = float(proposal.proposed_amount) / 3
        delivery_days = proposal.delivery_time
        
        for i in range(1, 4):
            Milestone.objects.create(
                contract=contract,
                title=f"Milestone {i}",
                description=f"Complete phase {i} of the project",
                amount=milestone_amount,
                due_date=datetime.now().date() + timedelta(days=delivery_days // 3 * i),
                status='pending'
            )
        
        return Response({
            'status': 'Proposal accepted',
            'contract_id': contract.id,
            'message': f'Contract created with {contract.milestones.count()} milestones'
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        proposal = self.get_object()
        if request.user != proposal.project.client:
            return Response(
                {'error': 'Only project owner can reject proposals'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        proposal.status = 'rejected'
        proposal.save()
        return Response({'status': 'Proposal rejected'})
