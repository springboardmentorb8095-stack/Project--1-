from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL

class Notification(models.Model):
    NOTIF_TYPES = [
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    notif_type = models.CharField(max_length=20, choices=NOTIF_TYPES, default='info')
    read = models.BooleanField(default=False)
    data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user} - {self.title or self.message[:40]}"

class NotificationSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notif_settings')
    inapp_sound_enabled = models.BooleanField(default=True)
    email_enabled = models.BooleanField(default=False)
    push_enabled = models.BooleanField(default=False)
    snooze_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Settings for {self.user.username}"

class PushSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='push_subscriptions')
    endpoint = models.TextField()
    p256dh = models.TextField()
    auth = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Push sub for {self.user.username}"

# Optional — review & rating system
class Review(models.Model):
    contract = models.ForeignKey('contracts.Contract', on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews')
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.reviewer} → {self.reviewee} ({self.rating})"
    
    # ===============================================
# ⏰ Scheduled Notification (optional premium feature)
# ===============================================

class ScheduledNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="scheduled_notifications")
    title = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    notif_type = models.CharField(
        max_length=20,
        choices=Notification.NOTIF_TYPES,
        default="info"
    )
    data = models.JSONField(default=dict, blank=True)
    deliver_at = models.DateTimeField()  # when to deliver
    delivered = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Scheduled for {self.user.username} at {self.deliver_at}"

