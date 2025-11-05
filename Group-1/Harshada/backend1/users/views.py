# users/views.py
from django.contrib.auth.models import User
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from django.http import JsonResponse
from django.db import IntegrityError

from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    ProfileClientSerializer,
    ProfileFreelancerSerializer,
)
from .models import Profile, ProfileClient, ProfileFreelancer


# ✅ Health check (test route)
def home(request):
    """Simple backend status check."""
    return JsonResponse({"message": "TalentLink Backend Running 🚀"})


# 👤 Register a new user
class RegisterView(generics.CreateAPIView):
    """
    Registers a new user (client or freelancer).
    Endpoint: POST /api/users/register/
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


# 👤 CRUD for logged-in user's main profile
class MeProfileView(APIView):
    """
    Create / Retrieve / Update / Delete generic user profile.
    Endpoint: /api/users/me/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retrieve logged-in user's profile."""
        try:
            profile = Profile.objects.get(user=request.user)
            return Response(ProfileSerializer(profile).data)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=404)

    def post(self, request):
        """Create a new profile."""
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(user=request.user)
                return Response(
                    {"message": "✅ Profile created successfully!", "profile": serializer.data},
                    status=201,
                )
            except IntegrityError:
                return Response({"error": "Profile already exists"}, status=400)
        return Response(serializer.errors, status=400)

    def put(self, request):
        """Update profile."""
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=404)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "✅ Profile updated successfully!", "profile": serializer.data}
            )
        return Response(serializer.errors, status=400)

    def delete(self, request):
        """Delete user profile."""
        try:
            profile = Profile.objects.get(user=request.user)
            profile.delete()
            return Response({"detail": "✅ Profile deleted successfully"})
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=404)


# 🧑‍💼 Client Profile (Create / Update / Retrieve)
class ProfileClientView(APIView):
    """
    Handles client profile creation and update.
    Endpoint: /api/users/client/profile/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retrieve client profile."""
        try:
            profile = ProfileClient.objects.get(user=request.user)
            return Response(ProfileClientSerializer(profile).data)
        except ProfileClient.DoesNotExist:
            return Response({"detail": "Client profile not found"}, status=404)

    def post(self, request):
        """Create new client profile."""
        serializer = ProfileClientSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(user=request.user)
                return Response(
                    {"message": "✅ Client profile created successfully!"},
                    status=201,
                )
            except IntegrityError:
                return Response({"error": "Client profile already exists"}, status=400)
        return Response(serializer.errors, status=400)

    def put(self, request):
        """Update or create if missing."""
        profile, created = ProfileClient.objects.get_or_create(user=request.user)
        serializer = ProfileClientSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            msg = (
                "✅ Client profile created successfully!"
                if created
                else "✅ Client profile updated successfully!"
            )
            return Response({"message": msg})
        return Response(serializer.errors, status=400)


# 🧑‍💻 Freelancer Profile (Create / Update / Retrieve)
class ProfileFreelancerView(APIView):
    """
    Handles freelancer profile creation and update.
    Endpoint: /api/users/freelancer/profile/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retrieve freelancer profile."""
        try:
            profile = ProfileFreelancer.objects.get(user=request.user)
            return Response(ProfileFreelancerSerializer(profile).data)
        except ProfileFreelancer.DoesNotExist:
            return Response({"detail": "Freelancer profile not found"}, status=404)

    def post(self, request):
        """Create new freelancer profile."""
        serializer = ProfileFreelancerSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(user=request.user)
                return Response(
                    {"message": "✅ Freelancer profile created successfully!"},
                    status=201,
                )
            except IntegrityError:
                return Response({"error": "Freelancer profile already exists"}, status=400)
        return Response(serializer.errors, status=400)

    def put(self, request):
        """Update or create freelancer profile."""
        profile, created = ProfileFreelancer.objects.get_or_create(user=request.user)
        serializer = ProfileFreelancerSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            msg = (
                "✅ Freelancer profile created successfully!"
                if created
                else "✅ Freelancer profile updated successfully!"
            )
            return Response({"message": msg})
        return Response(serializer.errors, status=400)


# 🔍 Profile Search & Filter API
class ProfileSearchFilterView(ListAPIView):
    """
    Search or filter profiles by username, skills, role, or availability.
    Example: ?search=python&role=freelancer&ordering=-hourly_rate
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user__username", "skills", "role", "availability"]
    ordering_fields = ["hourly_rate", "user__username"]
    ordering = ["user__username"]

    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get("role")
        availability = self.request.query_params.get("availability")

        if role:
            queryset = queryset.filter(role__iexact=role)
        if availability:
            queryset = queryset.filter(availability__icontains=availability)
        return queryset
