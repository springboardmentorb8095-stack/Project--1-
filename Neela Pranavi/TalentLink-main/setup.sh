#!/bin/bash

echo "🚀 Setting up TalentLink Project (Milestones 1 & 2)"
echo "=================================================="

# Backend setup
echo "📱 Setting up Django Backend..."
cd backend

# Create virtual environment (optional)
echo "Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "To activate virtual environment, run:"
echo "  On Windows: venv\Scripts\activate"
echo "  On macOS/Linux: source venv/bin/activate"

echo ""
echo "Installing Python dependencies..."
echo "pip install -r requirements.txt"

echo ""
echo "Setting up database..."
echo "python manage.py makemigrations accounts"
echo "python manage.py makemigrations profiles" 
echo "python manage.py makemigrations projects"
echo "python manage.py makemigrations proposals"
echo "python manage.py migrate"

echo ""
echo "Creating superuser (run this interactively)..."
echo "python manage.py createsuperuser"

echo ""
echo "Starting Django server..."
echo "python manage.py runserver"

echo ""
echo "📱 Setting up React Frontend..."
cd ../frontend

echo "Installing Node.js dependencies..."
echo "npm install"

echo ""
echo "Starting React development server..."
echo "npm start"

echo ""
echo "🎉 Setup Complete!"
echo "==================="
echo ""
echo "Backend will run on: http://localhost:8000"
echo "Frontend will run on: http://localhost:3000"
echo "Admin panel: http://localhost:8000/admin"
echo ""
echo "API Endpoints:"
echo "- POST /api/auth/register/ - User registration"
echo "- POST /api/auth/login/ - User login"
echo "- GET/PUT /api/profiles/me/ - User profile"
echo "- GET/POST /api/projects/ - Projects"
echo "- GET/POST /api/proposals/ - Proposals"
echo ""
echo "Default test users (create via admin or registration):"
echo "- Client: client@example.com / password123"
echo "- Freelancer: freelancer@example.com / password123"
