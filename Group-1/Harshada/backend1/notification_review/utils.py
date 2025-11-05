from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification
from django.forms.models import model_to_dict

def create_notification(to_user, message, from_user=None, url="", verb=""):
    notif = Notification.objects.create(
        to_user=to_user,
        from_user=from_user,
        message=message,
        url=url,
        verb=verb
    )
    # send to channel layer
    channel_layer = get_channel_layer()
    payload = {
        "id": notif.id,
        "message": notif.message,
        "from_user": getattr(from_user, "username", None),
        "url": notif.url,
        "verb": notif.verb,
        "created_at": notif.created_at.isoformat(),
    }
    async_to_sync(channel_layer.group_send)(
        f"user_{to_user.id}",
        {"type": "send_notification", "notification": payload}
    )
    return notif
