from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, FreelancerProfile, ClientProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.is_freelancer:
            FreelancerProfile.objects.create(
                user=instance,
                portfolio="",
                skills="",
                hourly_rate=0,
                availability=True,
            )
        elif instance.is_client:
            ClientProfile.objects.create(
                user=instance,
                company_name=instance.username,
                bio="",
                contact_email=instance.email,
            )
