# 🌐 TalentLink

TalentLink is a robust full-stack freelancing platform engineered to streamline collaboration between skilled freelancers and discerning clients. It empowers users to post projects, submit proposals, manage contracts, and communicate—all within a secure, role-based environment. Built using Django for backend logic, React for dynamic frontend interfaces, and AWS for scalable deployment, TalentLink delivers real-time project tracking, intuitive dashboards, and modular workflows. Whether you're a freelancer bidding on opportunities or a client managing multiple projects, TalentLink ensures clarity, speed, and trust at every step.

## 📦 Tech Stack

| Layer      |  Technology        |
|------------|--------------------|
| Frontend   | React (JavaScript) |
| Backend    | Django + DRF       |
| Database   | SQLite (dev)       |
| Auth       | JWT (Token-based)  |

## 📁 Project Structure

```talentlink/ ├── core/ # Django app (models, views, serializers) ├── talentlink-frontend/ # React frontend │ ├── src/ │ │ ├── pages/ # Dashboard, Login, ProjectFeed, etc. │ │ ├── components/ # Reusable UI components │ │ └── context/ # Auth and global state ├── db.sqlite3 # Development database └── manage.py # Django management script```

## ✅ Completed Tasks

### Task 1: Backend Setup

1.User Authentication (JWT-based login/register)
2.Profile Model: role, portfolio, skills, hourly rate, availability
3.Project Model: budget, duration, type, description
4.Proposal Model: bid, timeline, message, status
5.Serializers & ViewSets for all models
6.Role-based API endpoints for clients and freelancers

### Task 2: Frontend Integration

1.Landing Page with gradient theme and CTA buttons
2.Login/Register Pages with form validation
3.Profile Setup Page (redirected after first login)
4.Role-aware Dashboard:
  - Freelancer: Proposal history, profile info
  - Client: Posted projects, proposal management
5.Project Feed with filter UI (budget, duration, keyword)
6.Project Detail Page with proposal submission form
7.Proposal Management (accept/reject proposals)
  - Responsive UI with Bootstrap grid and custom styling
  - Toast Notifications for feedback and errors

  ## Features Overview

| Feature                     | Status |
|----------------------------|--------|
| Role-based routing         | ✅ Done
| Profile creation & editing | ✅ Done
| Project CRUD (client)      | ✅ Done
| Proposal submission        | ✅ Done
| Proposal review (client)   | ✅ Done
| Filter/search API          | ✅ Done
| Responsive design          | ✅ Done
