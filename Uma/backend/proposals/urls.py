<<<<<<< HEAD
from django.urls import path
from .views import SubmitProposalView, ProjectProposalsView, ProposalStatusUpdateView

urlpatterns = [
    path('submit/', SubmitProposalView.as_view(), name='submit-proposal'),
    path('project/<int:project_id>/', ProjectProposalsView.as_view(), name='project-proposals'),
    path('<int:pk>/status/', ProposalStatusUpdateView.as_view(), name='update-proposal-status'),
]
=======
from django.urls import path
from .views import SubmitProposalView, ProjectProposalsView, ProposalStatusUpdateView

urlpatterns = [
    path('submit/', SubmitProposalView.as_view(), name='submit-proposal'),
    path('project/<int:project_id>/', ProjectProposalsView.as_view(), name='project-proposals'),
    path('<int:pk>/status/', ProposalStatusUpdateView.as_view(), name='update-proposal-status'),
]
>>>>>>> f18711127ba5adc97ca66a5a12f3af6a229eeb6e
