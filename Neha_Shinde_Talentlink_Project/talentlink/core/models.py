from django.db import models
from django.contrib.auth.models import User

# 🔹 Skill model
class Skill(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Skills"

# 🔹 Profile model
class Profile(models.Model):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio = models.TextField(blank=True)
    portfolio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    availability = models.BooleanField(default=True)
    skills = models.ManyToManyField(Skill, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

# 🔹 Project model
class Project(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
    )

    client = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='projects', limit_choices_to={'role': 'client'})
    title = models.CharField(max_length=200)
    description = models.TextField()
    budget = models.DecimalField(max_digits=8, decimal_places=2)
    duration_weeks = models.IntegerField()
    skills_required = models.ManyToManyField(Skill)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

# 🔹 Proposal model
class Proposal(models.Model):
    freelancer = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='proposals', limit_choices_to={'role': 'freelancer'})
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='proposals')
    message = models.TextField()
    proposed_rate = models.DecimalField(max_digits=8, decimal_places=2)
    submitted_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # ✅ Add this
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')],
        default='pending'
    )

    def __str__(self):
        return f"Proposal by {self.freelancer.user.username} for {self.project.title}"

# 🔹 Contract model
class Contract(models.Model):
    proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE, related_name='contracts')
    client = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='contracts_as_client')
    freelancer = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='contracts_as_freelancer')
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Draft'),
            ('active', 'Active'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled')
        ],
        default='draft'
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    terms = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Contract for {self.proposal.project.title} ({self.status})"

# 🔹 Conversation model
class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name='conversations')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation {self.id}"

# 🔹 Message model
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages', null=True, blank=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username}"

# 🔹 Review model
class Review(models.Model):
    reviewer = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='given_reviews')
    reviewed = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_reviews')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer.user.username} for {self.reviewed.user.username}"

    
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To {self.user.username}: {self.message[:50]}"

