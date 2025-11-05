import pytest
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from lockdown_project.asgi import application
from notification_review.models import Notification

User = get_user_model()


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_notification_websocket_flow():
    """
    ✅ Test that NotificationConsumer:
      1. Accepts connection.
      2. Creates Notification in DB.
      3. Sends real-time JSON back to client.
    """

    # Create a test user
    user = await sync_to_async(User.objects.create_user)(
        username="harshada_test",
        password="test123"
    )

    communicator = WebsocketCommunicator(
        application,
        f"/ws/notifications/{user.id}/"
    )

    # Connect
    connected, _ = await communicator.connect()
    assert connected, "❌ WebSocket connection failed."

    # Send a test message
    await communicator.send_json_to({
        "title": "Test Title",
        "message": "Hello Harshada! This is a test notification.",
        "notif_type": "success"
    })

    # Receive message
    response = await communicator.receive_json_from(timeout=5)
    assert "message" in response, "❌ No message received from consumer."
    assert response["message"] == "Hello Harshada! This is a test notification."

    # Check DB saved notification
    notif_count = await sync_to_async(Notification.objects.count)()
    assert notif_count == 1, "❌ Notification not stored in DB."

    notif = await sync_to_async(Notification.objects.first)()
    assert notif.message.startswith("Hello Harshada"), "❌ DB message mismatch."

    # Disconnect
    await communicator.disconnect()
