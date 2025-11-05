from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

from .models import Notification, NotificationSettings, PushSubscription, ScheduledNotification
from .serializers import (
    NotificationSerializer,
    NotificationSettingsSerializer,
    PushSubscriptionSerializer,
    ScheduledNotificationSerializer,
)

# ============================================================
# 🔔 Notifications API
# ============================================================

class NotificationListView(generics.ListAPIView):
    """
    List all notifications for the authenticated user.
    Supports filters:
      ?unread=1
      ?type=info|warning|success|error
      ?offset=0&limit=20
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        qs = Notification.objects.filter(user=self.request.user).order_by("-created_at")

        notif_type = self.request.query_params.get("type")
        unread = self.request.query_params.get("unread")

        if notif_type:
            qs = qs.filter(notif_type=notif_type)
        if unread in ("1", "true", "True"):
            qs = qs.filter(read=False)

        # Lightweight manual pagination (offset/limit)
        try:
            offset = int(self.request.query_params.get("offset", 0))
            limit = int(self.request.query_params.get("limit", 20))
            limit = min(limit, 100)
            return qs[offset : offset + limit]
        except Exception:
            return qs[:50]


class NotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update (mark read/unread), or delete one notification.
    PATCH {"read": true}
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def mark_all_read(request):
    """Mark all notifications as read."""
    count = Notification.objects.filter(user=request.user, read=False).update(read=True)
    return Response({"status": "ok", "marked": count})


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def mark_all_unread(request):
    """Mark all notifications as unread."""
    count = Notification.objects.filter(user=request.user).update(read=False)
    return Response({"status": "ok", "unmarked": count})


# ============================================================
# ⚙️ Notification Settings (Sound / Email / Push)
# ============================================================

class NotificationSettingsView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update user's notification settings.
    Example payload:
      { "inapp_sound_enabled": true, "email_enabled": false, "push_enabled": true }
    """
    serializer_class = NotificationSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, _ = NotificationSettings.objects.get_or_create(user=self.request.user)
        return obj


# ============================================================
# 📲 Push Subscription (Web Push)
# ============================================================

class PushSubscriptionCreateView(generics.CreateAPIView):
    serializer_class = PushSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PushSubscriptionListView(generics.ListAPIView):
    serializer_class = PushSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PushSubscription.objects.filter(user=self.request.user)


class PushSubscriptionDeleteView(generics.DestroyAPIView):
    serializer_class = PushSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        return PushSubscription.objects.filter(user=self.request.user)


# ============================================================
# ⏰ Scheduled Notifications
# ============================================================

class ScheduledNotificationCreateView(generics.CreateAPIView):
    """
    Schedule notifications for later delivery.
    Example payload:
      { "title": "Contract ending soon", "message": "Your project will close tomorrow", "deliver_at": "2025-11-03T12:00:00Z" }
    """
    serializer_class = ScheduledNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        deliver_at = self.request.data.get("deliver_at") or timezone.now() + timedelta(minutes=5)
        serializer.save(user=self.request.user, deliver_at=deliver_at)


class ScheduledNotificationListView(generics.ListAPIView):
    serializer_class = ScheduledNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ScheduledNotification.objects.filter(user=self.request.user).order_by("deliver_at")
