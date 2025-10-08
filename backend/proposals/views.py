from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Proposal
from .serializers import ProposalSerializer
from projects.models import Project


# Freelancer: Submit Proposal
class SubmitProposalView(generics.CreateAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        project = Project.objects.get(id=self.request.data['project'])
        serializer.save(freelancer=self.request.user, project=project)

# Client: View Proposals for a specific project
class ProjectProposalsView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        project = Project.objects.get(id=project_id)

        # Only allow project owner to view proposals
        if project.client != self.request.user:
            return Proposal.objects.none()

        return Proposal.objects.filter(project=project)

# Client: Accept or Reject Proposal
class ProposalStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            proposal = Proposal.objects.get(pk=pk)
            project = proposal.project
            if project.client != request.user:
                return Response({'error': 'Not authorized'}, status=403)

            status = request.data.get('status')
            if status not in ['accepted', 'rejected']:
                return Response({'error': 'Invalid status'}, status=400)

            proposal.status = status
            proposal.save()
            return Response({'message': f'Proposal {status} successfully'})
        except Proposal.DoesNotExist:
            return Response({'error': 'Proposal not found'}, status=404)
