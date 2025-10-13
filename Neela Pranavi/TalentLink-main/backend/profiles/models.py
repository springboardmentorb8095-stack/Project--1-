
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    portfolio_url = models.URLField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    availability = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0)
    total_projects = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
