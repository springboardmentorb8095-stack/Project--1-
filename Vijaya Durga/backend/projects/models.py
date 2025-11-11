from django.db import models
from django.conf import settings

class Project(models.Model):
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='client_projects'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    skills_required = models.CharField(max_length=200)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100, help_text="e.g., 2 weeks, 1 month")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.client.username}"
