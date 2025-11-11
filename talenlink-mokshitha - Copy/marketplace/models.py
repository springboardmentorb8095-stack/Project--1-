from django.db import models

# -------- Profile --------
class Profile(models.Model):
    user_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    portfolio = models.URLField(blank=True, null=True)
    HOURLY_RATE_CHOICES = [
        ('500', '₹500/hr'),
        ('1000', '₹1000/hr'),
        ('1500', '₹1500/hr'),
        ('2000', '₹2000/hr'),
    ]
    hourly_rate = models.CharField(max_length=10, choices=HOURLY_RATE_CHOICES, default='500')
    AVAILABILITY_CHOICES = [
        ("available", "Available"),
        ("part_time", "Part-time"),
        ("busy", "Busy"),
    ]
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default="available")
    is_client = models.BooleanField(default=False)
    is_freelancer = models.BooleanField(default=False)

    def __str__(self):
        return self.user_name


# -------- Skill --------
class Skill(models.Model):
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='skills', null=True, blank=True)
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.name} ({self.level})" if self.level else self.name


# -------- Item --------
class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return self.name


# -------- Project --------
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='projects')
    skills_required = models.ManyToManyField('Skill', blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.title


# -------- Proposal --------
class Proposal(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="proposals")
    freelancer = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="freelancer_proposals")
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")],
        default="pending"
    )

    def __str__(self):
        return f"Proposal by {self.freelancer.user_name} for {self.project.title}"

# -------- Contract --------
class Contract(models.Model):
    proposal = models.OneToOneField('Proposal', on_delete=models.CASCADE, related_name='contract')
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    terms = models.TextField(default="Standard contract terms apply.")  # ✅ Added default

    def __str__(self):
        return f"Contract: {self.proposal.project.title}"



# -------- Message --------
class Message(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.user_name} to {self.receiver.user_name}"


# -------- Review --------
class Review(models.Model):
    reviewer = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='given_reviews')
    reviewee = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_reviews')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField()
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"Review for {self.reviewee.user_name} on {self.project.title}"
