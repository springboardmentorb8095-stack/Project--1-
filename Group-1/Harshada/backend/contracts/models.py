from django.db import models
from django.contrib.auth.models import User
from proposals.models import Proposal

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('active', 'Active'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
]

class Contract(models.Model):
    proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE)
    client = models.ForeignKey(User, related_name='client_contracts', on_delete=models.CASCADE)
    freelancer = models.ForeignKey(User, related_name='freelancer_contracts', on_delete=models.CASCADE)
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contract: {self.proposal.project.title} - {self.status}"
