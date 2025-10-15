from django.urls import path
from .views import (
    SubmitProposalView, 
    ProjectProposalsView, 
    ProposalStatusUpdateView,
    MyProposalsView,
    MyProposalUpdateView,
    MyProposalDeleteView
)

urlpatterns = [
    path('submit/', SubmitProposalView.as_view(), name='submit-proposal'),
    path('project/<int:project_id>/', ProjectProposalsView.as_view(), name='project-proposals'),
    path('<int:pk>/status/', ProposalStatusUpdateView.as_view(), name='update-proposal-status'),
    path('my-proposals/', MyProposalsView.as_view(), name='my-proposals'),
    path('my-proposals/<int:pk>/', MyProposalUpdateView.as_view(), name='my-proposal-update'),
    path('my-proposals/<int:pk>/delete/', MyProposalDeleteView.as_view(), name='my-proposal-delete'),
]