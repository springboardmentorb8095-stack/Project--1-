# users/views.py
from django.contrib.auth.models import User
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from django.http import JsonResponse

from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    ProfileClientSerializer,
    ProjectSerializer,   # ✅ new
)
from .models import Profile, ProfileClient, Project   # ✅ new


# ✅ Home route (for testing)
def home(request):
    return JsonResponse({"message": "Backend running 🚀"})


# 👤 Register a new user
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


# 👤 CRUD for logged-in user's profile
class MeProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        return Response(ProfileSerializer(profile).data)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request):
        profile = Profile.objects.get(user=request.user)
        profile.delete()
        return Response({"detail": "Profile deleted"})


# ✅ For Client Profile (Create + Update)
class ProfileClientView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = ProfileClient.objects.get(user=request.user)
            serializer = ProfileClientSerializer(profile)
            return Response(serializer.data)
        except ProfileClient.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=404)

    def post(self, request):
        print("📩 POST data received (Client):", request.data)  # Debug log
        serializer = ProfileClientSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(user=request.user)
                print("✅ Client Profile created for:", request.user)
                return Response({"message": "✅ Client profile created successfully!"})
            except Exception as e:
                print("🔥 ERROR while saving client profile:", str(e))
                return Response({"error": str(e)}, status=500)
        else:
            print("❌ Serializer Errors (Client):", serializer.errors)
            return Response(serializer.errors, status=400)

    def put(self, request):
        print("📩 PUT data received (Client):", request.data)
        profile, created = ProfileClient.objects.get_or_create(user=request.user)
        serializer = ProfileClientSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                msg = "✅ Client profile created successfully!" if created else "✅ Client profile updated successfully!"
                print(msg)
                return Response({"message": msg})
            except Exception as e:
                print("🔥 ERROR while updating client profile:", str(e))
                return Response({"error": str(e)}, status=500)
        else:
            print("❌ Serializer Errors (Client):", serializer.errors)
            return Response(serializer.errors, status=400)


# 🔎 New Feature: Search & Filter Profiles
class ProfileSearchFilterView(ListAPIView):
    """
    API to search and filter profiles by username, skills, role, availability,
    and order by hourly_rate
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]

    # Enable search & ordering
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user__username", "skills", "role", "availability"]
    ordering_fields = ["hourly_rate", "user__username"]
    ordering = ["user__username"]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Optional filter: role
        role = self.request.query_params.get("role")
        if role:
            queryset = queryset.filter(role__iexact=role)

        # Optional filter: availability
        availability = self.request.query_params.get("availability")
        if availability:
            queryset = queryset.filter(availability__icontains=availability)

        return queryset


# 🧩 New Feature: Project Create + View (for Clients)
class ProjectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get all projects of logged-in client"""
        projects = Project.objects.filter(client=request.user).order_by("-created_at")
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Post a new project"""
        print("📩 Project POST data:", request.data)
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(client=request.user)
            print("✅ Project saved for:", request.user.username)
            return Response({"message": "✅ Project posted successfully!"})
        else:
            print("❌ Errors:", serializer.errors)
            return Response(serializer.errors, status=400)
