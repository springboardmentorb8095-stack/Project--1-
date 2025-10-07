# users/views.py
from django.contrib.auth.models import User
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from django.http import JsonResponse, HttpResponse

from .serializers import RegisterSerializer, ProfileSerializer
from .models import Profile

# ---------------- Existing Views ---------------- #

def home(request):
    return JsonResponse({"message": "Backend running 🚀"})

# 👤 Register a new user
class RegisterView(generics.CreateAPIView):
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

# ---------------- New Feature: Search & Filter Profiles ---------------- #

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
