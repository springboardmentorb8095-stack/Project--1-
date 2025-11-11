# users/views.py
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.serializers import ModelSerializer
from .serializers import RegisterSerializer, ProfileSerializer
from .models import Profile
from django.http import HttpResponse
from rest_framework import status

def home(request):
    return HttpResponse("Welcome to Django Backend 🚀")
from django.http import JsonResponse

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
class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user


# ✅ Indentation here is very important
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "✅ User registered successfully!"},
            status=status.HTTP_201_CREATED
        )