from django.apps import AppConfig

class NotificationReviewConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notification_review'

    def ready(self):
        # Import signals when Django starts
        import notification_review.signals
