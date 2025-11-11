from django.db import models
from django.contrib.auth.models import User


# ------------------------------
# 🧩 Profile (Common)
# ------------------------------
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


# ------------------------------
# 🧩 ProfileClient (for clients)
# ------------------------------
class ProfileClient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    contact = models.CharField(max_length=20)
    business_name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Client: {self.user.username}"


# ------------------------------
# 🧩 ProfileFreelancer (for freelancers)
# ------------------------------
class ProfileFreelancer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    contact = models.CharField(max_length=20)
    skills = models.CharField(max_length=200)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.CharField(max_length=50)

    def __str__(self):
        return f"Freelancer: {self.user.username}"


# ------------------------------
# 🧩 Project Model (NEW)
# ------------------------------
class Project(models.Model):
    STATUS_CHOICES = (
        ("Project Posted", "Project Posted"),
        ("Active", "Active"),
        ("Completed", "Completed"),
    )

    client = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="project_app_projects"
    )
    title = models.CharField(max_length=200)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    skills = models.CharField(max_length=255)
    deadline = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Project Posted")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.client.username})"
