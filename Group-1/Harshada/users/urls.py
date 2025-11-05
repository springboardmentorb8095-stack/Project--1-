from django.urls import path
from .views import RegisterView, LoginView, MeProfileView, ForgotPasswordView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeProfileView.as_view(), name="me"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
]
