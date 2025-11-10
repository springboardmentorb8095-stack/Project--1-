from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import (
    User, FreelancerProfile, ClientProfile,
    Proposal, Contract, Message, Notification
)

# ---------- Auto-create profiles ----------
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.is_freelancer:
            FreelancerProfile.objects.create(
                user=instance,
                portfolio="",
                skills="",
                hourly_rate=0,
                availability=True
            )
        elif instance.is_client:
            ClientProfile.objects.create(
                user=instance,
                company_name=instance.username,
                bio="",
                contact_email=instance.email
            )


# ---------- Auto-create contract when proposal accepted ----------
@receiver(post_save, sender=Proposal)
def create_contract_on_accept(sender, instance, **kwargs):
    """
    Automatically create a contract when a proposal is accepted.
    """
    if instance.status == 'Accepted' and not Contract.objects.filter(proposal=instance).exists():
        Contract.objects.create(
            proposal=instance,
            client=instance.project.client,
            freelancer=instance.freelancer,
            payment_amount=instance.bid_amount,
            status='Active'
        )


# ---------- Create notification when a new message is sent ----------
@receiver(post_save, sender=Message)
def create_notification_on_message(sender, instance, created, **kwargs):
    """
    Automatically notify receiver when a new message is created.
    """
    if created:
        Notification.objects.create(
            user=instance.receiver,
            message=f"New message from {instance.sender.username}",
            link=f"/contracts/{instance.contract.id}/chat"
        )
