
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .models import Profile, Skill
from .serializers import ProfileSerializer, SkillSerializer

class ProfileCreateUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

class ProfileListView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Profile.objects.select_related('user').prefetch_related('skills')
        user_type = self.request.query_params.get('user_type')
        skills = self.request.query_params.get('skills')
        location = self.request.query_params.get('location')
        available = self.request.query_params.get('available')

        if user_type:
            queryset = queryset.filter(user__user_type=user_type)

        if skills:
            skill_names = skills.split(',')
            queryset = queryset.filter(skills__name__in=skill_names).distinct()

        if location:
            queryset = queryset.filter(location__icontains=location)

        if available == 'true':
            queryset = queryset.filter(availability=True)

        return queryset

class SkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def profile_detail(request, user_id):
    try:
        profile = Profile.objects.select_related('user').prefetch_related('skills').get(user_id=user_id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
