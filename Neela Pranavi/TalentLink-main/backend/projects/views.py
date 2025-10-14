
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer

class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.select_related('client').prefetch_related('skills_required')

        # Filters
        skills = self.request.query_params.get('skills')
        budget_min = self.request.query_params.get('budget_min')
        budget_max = self.request.query_params.get('budget_max')
        duration = self.request.query_params.get('duration')
        status_filter = self.request.query_params.get('status', 'open')
        search = self.request.query_params.get('search')

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        if skills:
            skill_names = skills.split(',')
            queryset = queryset.filter(skills_required__name__in=skill_names).distinct()

        if budget_min:
            queryset = queryset.filter(Q(budget_min__gte=budget_min) | Q(budget_max__gte=budget_min))

        if budget_max:
            queryset = queryset.filter(Q(budget_min__lte=budget_max) | Q(budget_max__lte=budget_max))

        if duration:
            queryset = queryset.filter(duration=duration)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return Project.objects.filter(client=self.request.user)
        return Project.objects.select_related('client').prefetch_related('skills_required')

class MyProjectsView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(client=self.request.user).select_related('client').prefetch_related('skills_required')
