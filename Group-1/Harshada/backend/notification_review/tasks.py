from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_email_placeholder(subject, message, to_email):
    # this is a simple placeholder using Django send_mail
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [to_email],
        fail_silently=True,
    )
