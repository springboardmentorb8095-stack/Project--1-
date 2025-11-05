import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from asgiref.sync import sync_to_async
from .models import Notification, NotificationSettings

User = get_user_model()
logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket consumer for sending real-time notifications.
    - Each connected user joins group `user_<user_id>`.
    - Receives and stores incoming notifications.
    - Optionally emails users if their settings allow.
    """

    async def connect(self):
        """Called when a WebSocket connection is established."""
        self.user_id = self.scope["url_route"]["kwargs"].get("user_id")
        if not self.user_id:
            await self.close()
            return

        self.group_name = f"user_{self.user_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        logger.info(f"✅ WebSocket connected for user {self.user_id}")
        await self.send_json({"status": "connected", "user_id": self.user_id})

    async def disconnect(self, code):
        """Called when the WebSocket disconnects."""
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            logger.info(f"❌ WebSocket disconnected for user {self.user_id}")

    async def receive_json(self, content, **kwargs):
        """
        Handles messages received from the client.
        Typically, this means creating a Notification in the DB and broadcasting it.
        """
        message = content.get("message")
        if not message:
            return

        try:
            user = await sync_to_async(User.objects.get)(id=self.user_id)

            notif = await sync_to_async(Notification.objects.create)(
                user=user,
                title=content.get("title", ""),
                message=message,
                notif_type=content.get("notif_type", "info"),
                data=content.get("data", {}),
            )

            # Send it back to the group (real-time broadcast)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "send_notification",
                    "id": notif.id,
                    "title": notif.title,
                    "message": notif.message,
                    "notif_type": notif.notif_type,
                    "data": notif.data,
                    "read": notif.read,
                    "created_at": notif.created_at.isoformat(),
                },
            )

            # Also handle optional email notification if user settings allow
            await self._send_email_if_enabled(user, notif)

        except Exception as e:
            logger.error(f"⚠️ Error creating notification: {e}")
            await self.send_json({"error": str(e)})

    async def send_notification(self, event):
        """Send notification payload to the frontend client."""
        await self.send_json(event)

    # ---------------- Helper methods ---------------- #

    @sync_to_async
    def _send_email_if_enabled(self, user, notif):
        """Send email if user has email notifications turned on."""
        try:
            settings_obj, _ = NotificationSettings.objects.get_or_create(user=user)
            if settings_obj.email_enabled:
                subject = notif.title or "New Notification"
                send_mail(
                    subject,
                    notif.message,
                    getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
                    [user.email],
                    fail_silently=True,
                )
        except Exception as e:
            logger.warning(f"Email not sent: {e}")
