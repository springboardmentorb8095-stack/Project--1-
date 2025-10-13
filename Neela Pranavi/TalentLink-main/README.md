# TalentLink - Professional Matchmaking Platform

A full-stack web application that connects freelancers with clients, built with Django REST Framework and React.js.

## Features

### Milestone 1 & 2 Implementation:
- ✅ User Authentication (JWT-based)
- ✅ Role-based Access Control (Client/Freelancer)
- ✅ User Profiles with Skills Management
- ✅ Project Posting and Management
- ✅ Project Search and Filtering
- ✅ Proposal Submission System
- ✅ Proposal Management for Clients

## Tech Stack

**Backend:**
- Django 4.2.7
- Django REST Framework 3.14.0
- JWT Authentication
- SQLite (development)
- PostgreSQL (production)

**Frontend:**
- React 18
- React Router DOM
- Material-UI
- Axios for API calls

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET/PUT /api/auth/profile/` - User profile

### Profiles
- `GET /api/profiles/` - List all profiles (with filters)
- `GET/PUT /api/profiles/me/` - Current user's profile
- `GET /api/profiles/<user_id>/` - Specific user profile
- `GET/POST /api/profiles/skills/` - Skills management

### Projects
- `GET/POST /api/projects/` - List/Create projects
- `GET/PUT/DELETE /api/projects/<id>/` - Project detail
- `GET /api/projects/my-projects/` - User's projects

### Proposals
- `GET/POST /api/proposals/` - List/Create proposals
- `GET/PUT /api/proposals/<id>/` - Proposal detail
- `GET /api/proposals/project/<project_id>/` - Project proposals
- `POST /api/proposals/<id>/accept/` - Accept proposal
- `POST /api/proposals/<id>/reject/` - Reject proposal

## Usage

1. **Register as Client or Freelancer**
2. **Complete your profile** with relevant information
3. **Clients can:**
   - Post new projects
   - Browse and manage their projects
   - Review and accept/reject proposals
4. **Freelancers can:**
   - Browse available projects
   - Submit proposals
   - Track proposal status

## Project Structure

```
talentlink_project/
├── backend/
│   ├── talentlink/          # Django project settings
│   ├── accounts/            # User authentication
│   ├── profiles/            # User profiles and skills
│   ├── projects/            # Project management
│   ├── proposals/           # Proposal system
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Main pages
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/
└── docker-compose.yml
```

## Development Notes

- This implements Milestones 1 & 2 of the TalentLink project
- SQLite is used for local development
- JWT tokens are used for authentication
- CORS is configured for React development server
- All models include proper relationships and constraints

## Next Steps (Milestone 3 & 4)

- Contract management system
- Real-time messaging
- Review and rating system
- Enhanced UI/UX
- Deployment configuration
- Testing suite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
"# TalentLink" 
