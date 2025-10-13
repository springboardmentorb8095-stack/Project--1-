
from django.db import models
from django.contrib.auth import get_user_model
from profiles.models import Skill

User = get_user_model()

class Project(models.Model):
    BUDGET_TYPES = (
        ('fixed', 'Fixed Price'),
        ('hourly', 'Hourly Rate'),
    )

    DURATION_CHOICES = (
        ('less_than_1_month', 'Less than 1 month'),
        ('1_3_months', '1-3 months'),
        ('3_6_months', '3-6 months'),
        ('more_than_6_months', 'More than 6 months'),
    )

    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_projects')
    skills_required = models.ManyToManyField(Skill, blank=True)
    budget_type = models.CharField(max_length=10, choices=BUDGET_TYPES)
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deadline = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
