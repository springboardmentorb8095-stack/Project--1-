from django.db.models.signals import post_save
from django.dispatch import receiver
from contracts.models import Contract  # adjust if model path different
from .models import Notification
from asgiref.sync import sync_to_async

@receiver(post_save, sender=Contract)
def contract_status_changed(sender, instance, created, **kwargs):
    # adjust 'status' field name as in your contracts app
    # when status becomes 'completed' create notifications to client and freelancer
    if not created:
        if getattr(instance, "status", "").lower() == "completed":
            # notify client and freelancer (assume instance.client and instance.freelancer exist)
            recipients = []
            if hasattr(instance, "client") and instance.client:
                recipients.append(instance.client)
            if hasattr(instance, "freelancer") and instance.freelancer:
                recipients.append(instance.freelancer)
            for u in recipients:
                Notification.objects.create(
                    user=u,
                    title="Contract Completed",
                    message=f"Contract #{instance.id} has been marked completed.",
                    notif_type="project",
                    data={"contract_id": instance.id}
                )
