from django.urls import path, re_path
from . import views
from . import consumers

# Django REST Framework API routes
urlpatterns = [
    # 🔔 Notifications
    path("api/notifications/", views.NotificationListView.as_view(), name="notification-list"),
    path("api/notifications/<int:pk>/", views.NotificationDetailView.as_view(), name="notification-detail"),
    path("api/notifications/mark-all-read/", views.mark_all_read, name="notifications-mark-all-read"),
    path("api/notifications/mark-all-unread/", views.mark_all_unread, name="notifications-mark-all-unread"),

    # ⚙️ User Notification Settings
    path("api/notification-settings/", views.NotificationSettingsView.as_view(), name="notification-settings"),

    # 📲 Push Subscriptions
    path("api/push-subscriptions/", views.PushSubscriptionCreateView.as_view(), name="push-sub-create"),
    path("api/push-subscriptions/list/", views.PushSubscriptionListView.as_view(), name="push-sub-list"),
    path("api/push-subscriptions/<int:id>/", views.PushSubscriptionDeleteView.as_view(), name="push-sub-delete"),

    # ⏰ Scheduled Notifications
    path("api/scheduled-notifications/create/", views.ScheduledNotificationCreateView.as_view(), name="scheduled-notif-create"),
    path("api/scheduled-notifications/", views.ScheduledNotificationListView.as_view(), name="scheduled-notif-list"),
]

# =====================================================
# 🌐 WebSocket Routing (Channels)
# =====================================================
# This must be imported in your root asgi.py (via ProtocolTypeRouter)
websocket_urlpatterns = [
    re_path(r"ws/notifications/(?P<user_id>\d+)/$", consumers.NotificationConsumer.as_asgi()),
]
