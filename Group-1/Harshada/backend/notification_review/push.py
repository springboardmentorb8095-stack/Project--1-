# backend/notification_review/push.py
from pywebpush import webpush, WebPushException
from django.conf import settings

VAPID_PRIVATE_KEY = getattr(settings, "VAPID_PRIVATE_KEY", None)
VAPID_CLAIMS = {"sub": "mailto:admin@example.com"}

def send_push(subscription_info, payload):
    try:
        webpush(
            subscription_info=subscription_info,
            data=payload,
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS,
        )
        return True
    except WebPushException as ex:
        print("WebPush error:", ex)
        return False
