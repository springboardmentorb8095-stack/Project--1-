
from django.urls import path
from .views import (
    ProposalListCreateView, ProposalDetailView, ProjectProposalsView,
    accept_proposal, reject_proposal
)

urlpatterns = [
    path('', ProposalListCreateView.as_view(), name='proposal-list-create'),
    path('<int:pk>/', ProposalDetailView.as_view(), name='proposal-detail'),
    path('project/<int:project_id>/', ProjectProposalsView.as_view(), name='project-proposals'),
    path('<int:proposal_id>/accept/', accept_proposal, name='accept-proposal'),
    path('<int:proposal_id>/reject/', reject_proposal, name='reject-proposal'),
]
