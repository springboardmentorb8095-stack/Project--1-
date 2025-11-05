from rest_framework import serializers
from django.utils.timesince import timesince
from .models import (
    Notification,
    NotificationSettings,
    PushSubscription,
    Review,
    ScheduledNotification,
)

# ============================================================
# 🔔 Notification Serializers
# ============================================================

class NotificationSerializer(serializers.ModelSerializer):
    """Serialize notifications with extra fields for UI."""
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = "__all__"

    def get_time_ago(self, obj):
        """Return a human-readable 'time ago' string like '5m ago'."""
        try:
            return timesince(obj.created_at).split(",")[0] + " ago"
        except Exception:
            return "just now"


# ============================================================
# ⚙️ Notification Settings Serializer
# ============================================================

class NotificationSettingsSerializer(serializers.ModelSerializer):
    """User-level notification preferences for sound, push, etc."""
    class Meta:
        model = NotificationSettings
        fields = "__all__"
        read_only_fields = ["user"]


# ============================================================
# 📲 Push Subscription Serializer (Web Push)
# ============================================================

class PushSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushSubscription
        fields = "__all__"
        read_only_fields = ["user", "created_at"]


# ============================================================
# ⭐ Review Serializer (for rating system)
# ============================================================

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source="reviewer.username", read_only=True)
    reviewee_name = serializers.CharField(source="reviewee.username", read_only=True)

    class Meta:
        model = Review
        fields = "__all__"


# ============================================================
# ⏰ Scheduled Notifications Serializer
# ============================================================

class ScheduledNotificationSerializer(serializers.ModelSerializer):
    """Used to create and view scheduled notifications."""
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    time_until_delivery = serializers.SerializerMethodField()

    class Meta:
        model = ScheduledNotification
        fields = "__all__"
        read_only_fields = ["user", "created_at"]

    def get_time_until_delivery(self, obj):
        """Show how long until delivery (for frontend UX)."""
        from django.utils import timezone
        delta = obj.deliver_at - timezone.now()
        total_minutes = int(delta.total_seconds() / 60)
        if total_minutes < 1:
            return "less than a minute"
        elif total_minutes < 60:
            return f"{total_minutes} min"
        elif total_minutes < 1440:
            return f"{total_minutes // 60} hr"
        else:
            return f"{total_minutes // 1440} days"
