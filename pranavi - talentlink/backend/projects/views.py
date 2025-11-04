from rest_framework import viewsets, permissions, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        # Pass client to serializer.save()
        serializer.save(client=self.request.user)
    
    def get_queryset(self):
        queryset = Project.objects.all()
        
        # Filter by budget range
        min_budget = self.request.query_params.get('min_budget')
        max_budget = self.request.query_params.get('max_budget')
        
        if min_budget:
            queryset = queryset.filter(budget_min__gte=min_budget)
        if max_budget:
            queryset = queryset.filter(budget_max__lte=max_budget)
        
        return queryset
