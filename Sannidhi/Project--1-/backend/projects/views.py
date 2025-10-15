from rest_framework import generics, permissions
from .models import Project
from .serializers import ProjectSerializer

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

# Retrieve or delete a project (Client only)
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        # Only allow the client who created it to edit
        if self.request.user == serializer.instance.client:
            serializer.save()
        else:
            raise PermissionError("You are not authorized to edit this project.")