
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .models import Proposal
from .serializers import ProposalSerializer, ProposalCreateSerializer, ProposalStatusUpdateSerializer

class ProposalListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProposalCreateSerializer
        return ProposalSerializer

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project')

        if user.user_type == 'client':
            # Clients see proposals for their projects
            queryset = Proposal.objects.filter(project__client=user)
            if project_id:
                queryset = queryset.filter(project_id=project_id)
        else:
            # Freelancers see their own proposals
            queryset = Proposal.objects.filter(freelancer=user)

        return queryset.select_related('project', 'freelancer', 'freelancer__profile')

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)

class ProposalDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH'] and self.request.user.user_type == 'client':
            return ProposalStatusUpdateSerializer
        return ProposalSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'client':
            return Proposal.objects.filter(project__client=user)
        else:
            return Proposal.objects.filter(freelancer=user)

class ProjectProposalsView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Proposal.objects.filter(
            project_id=project_id,
            project__client=self.request.user
        ).select_related('freelancer', 'freelancer__profile')

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def accept_proposal(request, proposal_id):
    try:
        proposal = Proposal.objects.get(id=proposal_id, project__client=request.user)

        if proposal.status != 'pending':
            return Response({'error': 'This proposal has already been processed'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Accept this proposal
        proposal.status = 'accepted'
        proposal.save()

        # Reject all other proposals for this project
        Proposal.objects.filter(
            project=proposal.project,
            status='pending'
        ).exclude(id=proposal_id).update(status='rejected')

        # Update project status
        proposal.project.status = 'in_progress'
        proposal.project.save()

        return Response({'message': 'Proposal accepted successfully'}, 
                       status=status.HTTP_200_OK)

    except Proposal.DoesNotExist:
        return Response({'error': 'Proposal not found'}, 
                       status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reject_proposal(request, proposal_id):
    try:
        proposal = Proposal.objects.get(id=proposal_id, project__client=request.user)

        if proposal.status != 'pending':
            return Response({'error': 'This proposal has already been processed'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        proposal.status = 'rejected'
        proposal.save()

        return Response({'message': 'Proposal rejected successfully'}, 
                       status=status.HTTP_200_OK)

    except Proposal.DoesNotExist:
        return Response({'error': 'Proposal not found'}, 
                       status=status.HTTP_404_NOT_FOUND)
