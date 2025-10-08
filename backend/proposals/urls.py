from django.urls import path
from .views import SubmitProposalView, ProjectProposalsView, ProposalStatusUpdateView

urlpatterns = [
    path('submit/', SubmitProposalView.as_view(), name='submit-proposal'),
    path('project/<int:project_id>/', ProjectProposalsView.as_view(), name='project-proposals'),
    path('<int:pk>/status/', ProposalStatusUpdateView.as_view(), name='update-proposal-status'),
]
