from django.test import TestCase
from django.contrib.auth.models import User
from .models import Skill, Profile, Project

class SkillModelTest(TestCase):
    def test_skill_str(self):
        skill = Skill.objects.create(name="Python")
        self.assertEqual(str(skill), "Python")

class ProfileModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="neha", password="secure123")

    def test_profile_creation(self):
        profile = Profile.objects.create(user=self.user, role="freelancer", hourly_rate=500)
        self.assertEqual(str(profile), "neha (freelancer)")
        self.assertTrue(profile.availability)

class ProjectModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="clientuser", password="secure123")
        self.client_profile = Profile.objects.create(user=self.user, role="client")

    def test_project_creation(self):
        project = Project.objects.create(
            client=self.client_profile,
            title="Build Dashboard",
            description="Create a responsive dashboard",
            budget=10000,
            duration_weeks=4
        )
        self.assertEqual(str(project), "Build Dashboard")
        self.assertEqual(project.status, "open")
