from rest_framework import generics, permissions
from .models import Project
from .serializers import ProjectSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


# Create new project (Client)
class ProjectCreateView(generics.CreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

# List all projects (for freelancers)
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]

# Retrieve, update, or delete a project (Client only)
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user == serializer.instance.client:
            serializer.save()
        else:
            raise PermissionError("You are not authorized to edit this project.")

# Project Search View
class ProjectSearchView(APIView):
    permission_classes = []

    def get(self, request, format=None):
        search = request.GET.get('search', '')
        budget_min = request.GET.get('budget_min')
        budget_max = request.GET.get('budget_max')
       
        queryset = Project.objects.all()

        if search:
            queryset = queryset.filter(title__icontains=search)  # search by title
        if budget_min:
            queryset = queryset.filter(budget__gte=budget_min)
        if budget_max:
            queryset = queryset.filter(budget__lte=budget_max)
        

        serializer = ProjectSerializer(queryset, many=True)
        return Response(serializer.data)