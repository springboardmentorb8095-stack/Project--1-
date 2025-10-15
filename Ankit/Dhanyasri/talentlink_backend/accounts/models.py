from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# ---------- Custom User Model ----------
class User(AbstractUser):
    is_client = models.BooleanField(default=False)
    is_freelancer = models.BooleanField(default=False)

    # Fix related_name clashes with Django's built-in groups and permissions
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    def __str__(self):
        return self.username


# ---------- Profile Model ----------
class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    contact_email = models.EmailField()

    def __str__(self):
        return self.company_name

class FreelancerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    portfolio = models.TextField(blank=True)
    skills = models.CharField(max_length=255)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    availability = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username


# ---------- Project Model ----------
class Project(models.Model):
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(help_text="Duration in days")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.client.username})"


# ---------- Proposal Model ----------
class Proposal(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="proposals")
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="proposals")
    proposal_text = models.TextField()
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="Pending")  # Pending / Accepted / Rejected
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Proposal by {self.freelancer.username} for {self.project.title}"
