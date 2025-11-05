# users/views.py
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse

from .models import Profile
from .serializers import ProfileSerializer, RegisterSerializer


# 🌍 Health check endpoint
def home(request):
    return JsonResponse({"message": "TalentLink Backend is running 🚀"})


# 🧾 Register new user (Client or Freelancer)
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # ✅ Automatically create a Profile for the new user
        role = request.data.get("role", "freelancer")
        profile, created = Profile.objects.get_or_create(user=user, defaults={"role": role})

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response(
            {
                "message": "✅ Registration successful",
                "username": user.username,
                "email": user.email,
                "role": profile.role,
                "access": str(access),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


# 🔐 User Login (JWT)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid username or password ❌"}, status=401)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        profile, _ = Profile.objects.get_or_create(user=user)

        return Response(
            {
                "message": "✅ Login successful",
                "username": user.username,
                "role": profile.role,
                "access": str(access),
                "refresh": str(refresh),
            },
            status=200,
        )


# 👤 Get or Update logged-in user's Profile
class MeProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=200)

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "✅ Profile updated successfully!", "data": serializer.data}, status=200)
        return Response(serializer.errors, status=400)


# 🔁 Forgot password (simulated)
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not User.objects.filter(email=email).exists():
            return Response({"error": "Email not found ❌"}, status=404)
        # In real apps, send a password reset email here.
        return Response({"message": "📩 Password reset link sent to your email (simulated)."}, status=200)
