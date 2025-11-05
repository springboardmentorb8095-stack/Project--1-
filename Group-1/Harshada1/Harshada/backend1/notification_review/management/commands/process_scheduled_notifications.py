from django.core.management.base import BaseCommand
from django.utils import timezone
from notification_review.models import ScheduledNotification, Notification, PushSubscription, UserNotificationSetting
from django.conf import settings
from notification_review.push import send_push
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

class Command(BaseCommand):
    help = "Deliver scheduled notifications (run every minute via cron or supervisor)"

    def handle(self, *args, **options):
        now = timezone.now()
        due = ScheduledNotification.objects.filter(delivered=False, deliver_at__lte=now)
        for s in due:
            # create Notification
            notif = Notification.objects.create(
                user=s.user,
                title=s.title,
                message=s.message,
                notif_type=s.notif_type,
                data=s.data
            )
            # push to websocket group
            channel_layer = get_channel_layer()
            payload = {
                "type":"send_notification",
                "id": notif.id,
                "title": notif.title,
                "message": notif.message,
                "notif_type": notif.notif_type,
                "data": notif.data,
                "read": notif.read,
                "created_at": notif.created_at.isoformat(),
            }
            async_to_sync(channel_layer.group_send)(f"user_{s.user.id}", payload)

            # web push if enabled
            try:
                settings_obj = UserNotificationSetting.objects.filter(user=s.user).first()
                if settings_obj and settings_obj.push_enabled:
                    subs = PushSubscription.objects.filter(user=s.user)
                    for sub in subs:
                        subscription_info = {
                            "endpoint": sub.endpoint,
                            "keys": {"p256dh": sub.p256dh, "auth": sub.auth}
                        }
                        send_push(subscription_info, json.dumps({"title": notif.title, "body": notif.message, "data": notif.data}))
            except Exception as e:
                self.stdout.write(str(e))

            s.delivered = True
            s.save()
