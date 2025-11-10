from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

# ---------- Custom User Model ----------
class User(AbstractUser):
    is_client = models.BooleanField(default=False)
    is_freelancer = models.BooleanField(default=False)

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


# ---------- Client Profile ----------
class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    contact_email = models.EmailField()
    profile_image = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    def __str__(self):
        return self.company_name


# ---------- Freelancer Profile ----------
class FreelancerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    portfolio = models.TextField(blank=True)
    skills = models.CharField(max_length=255)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    availability = models.BooleanField(default=True)
    profile_image = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    def __str__(self):
        return self.user.username


# ---------- Project ----------
class Project(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    budget = models.FloatField()
    duration = models.IntegerField(help_text="Duration in days")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# ---------- Proposal ----------
class Proposal(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="proposals")
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="proposals")
    proposal_text = models.TextField()
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="Pending")  # Pending / Accepted / Rejected
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Proposal by {self.freelancer.username} for {self.project.title}"


# ---------- Contract ----------
class Contract(models.Model):
    proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name='contract')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_contracts')
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='freelancer_contracts')
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Active', 'Active'),
            ('Completed', 'Completed'),
            ('Cancelled', 'Cancelled'),
        ],
        default='Pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    rating = models.PositiveSmallIntegerField(null=True, blank=True)  
    review = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Contract: {self.proposal.project.title} ({self.status})"



# ---------- Message ----------
class Message(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username} at {self.timestamp}"


# ---------- Notification ----------
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("project", "Project"),
        ("proposal", "Proposal"),
        ("message", "Message"),
        ("system", "System"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications",
        help_text="User who will receive this notification"
    )
    message = models.CharField(max_length=255)
    link = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Optional link to related page (e.g. /contracts/3/)"
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        default="system"
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"[{self.notification_type.upper()}] {self.message[:50]} → {self.user.username}"


# ---------- Signals ----------
@receiver(post_save, sender=Proposal)
def create_contract_on_accept(sender, instance, **kwargs):
    """
    Automatically create a contract when a proposal is accepted.
    """
    if instance.status == 'Accepted' and not hasattr(instance, 'contract'):
        Contract.objects.create(
            proposal=instance,
            client=instance.project.client,
            freelancer=instance.freelancer,
            payment_amount=instance.bid_amount,
            status='Active'
        )


@receiver(post_save, sender=Message)
def create_notification_on_message(sender, instance, created, **kwargs):
    """
    Automatically create a notification when a new message is sent.
    """
    if created:
        Notification.objects.create(
            user=instance.receiver,
            message=f"New message from {instance.sender.username}",
            link=f"/contracts/{instance.contract.id}/chat",
            notification_type="message"
        )


@receiver(post_save, sender=Contract)
def notify_on_contract_status_change(sender, instance, **kwargs):
    """
    Notify both client and freelancer when a contract is completed.
    """
    if instance.status == "Completed":
        # Notify client
        Notification.objects.create(
            user=instance.client,
            message=f"Your project '{instance.proposal.project.title}' has been marked as completed.",
            link=f"/contracts/{instance.id}/",
            notification_type="project"
        )

        # Notify freelancer
        Notification.objects.create(
            user=instance.freelancer,
            message=f"You have successfully completed the project '{instance.proposal.project.title}'.",
            link=f"/contracts/{instance.id}/",
            notification_type="project"
        )
