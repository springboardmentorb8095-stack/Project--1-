from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='freelancer')
    portfolio = models.URLField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
