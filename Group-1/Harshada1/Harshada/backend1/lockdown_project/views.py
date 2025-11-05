@api_view(['POST'])
def create_project(request):
    data = request.data
    project = Project.objects.create(
        title=data['title'],
        budget=data['budget'],
        deadline=data['deadline'],
        description=data['description'],
        client_id=data['client'],
    )
    project.skills.set(
        [Skill.objects.get_or_create(name=s)[0] for s in data.get('skills', [])]
    )
    project.save()
    return Response({"message": "Project created successfully!"})
