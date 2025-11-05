# 🌟 TalentLink – Freelance Marketplace Platform

> A full-stack web application connecting clients and freelancers to collaborate, hire, and grow together — built with **React.js**, **Django REST Framework**, and **SQLite**.

---

## 🧭 Overview

**TalentLink** is a dynamic **freelance marketplace platform** where clients can post projects, and freelancers can bid, showcase skills, and manage proposals.  
It simplifies freelance hiring by providing structured dashboards, profile management, and proposal tracking.

---

## 🧠 Core Features

### 👥 User Management
- User Registration & Login with JWT Authentication  
- Separate dashboards for **Clients** and **Freelancers**  
- Role-based redirection after login  

### 🧑‍💻 Freelancer Features
- Create and update profile (Bio, Skills, Portfolio, Hourly Rate, Availability)
- Browse available projects based on filters (Skill, Budget, Duration)
- Submit proposals with pricing and description
- Track proposal status (Accepted / Rejected / Pending)

### 💼 Client Features
- Post new projects with description, budget, skills, and duration
- Edit or delete existing projects
- View all proposals submitted by freelancers
- Accept or reject proposals individually

### 🔍 Search & Filter
- Projects can be filtered by:
  - Required Skill
  - Budget Range
  - Duration

### 🖥️ Interface & Design
- Clean and responsive layout built using **React.js**  
- Organized dashboards and modern UI components  
- Integrated with **Axios** for smooth frontend-backend communication  

---

## ⚙️ Tech Stack

| Category | Technologies Used |
|-----------|------------------|
| **Frontend** | React.js, JavaScript (ES6+), Axios, CSS3 |
| **Backend** | Django, Django REST Framework (DRF) |
| **Database** | SQLite |
| **Authentication** | JWT (JSON Web Token) |
| **Version Control** | Git & GitHub |
| **Package Manager** | npm |
| **IDE Used** | Visual Studio Code |
| **Testing** | Postman (for API testing) |

---

## 🧩 Project Structure

D:\talentlink\Mokshitha_TalentLink
│
├── frontend/          → React Frontend
├── marketplace/       → Django App (models, views, urls)
├── talentlink/        → Django Project (settings, urls, wsgi)
├── db.sqlite3         → Database file
└── manage.py          → Django entry point




---

## 🔗 Backend API Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/register/` | POST | Register new users |
| `/api/login/` | POST | Authenticate users (JWT Token) |
| `/api/set-role/` | POST | Assign role (Client / Freelancer) |
| `/api/profiles/` | GET, PUT | Retrieve or update profile details |
| `/api/projects/` | GET, POST | List or create projects |
| `/api/projects/<id>/` | GET, PUT, DELETE | View, edit, or delete a specific project |
| `/api/proposals/` | GET, POST | Submit or fetch proposals |
| `/api/proposals/<id>/` | PUT | Update proposal status (Accept / Reject) |

---

🚀 Workflow Summary

1️⃣ User registers & logs in → JWT authentication
2️⃣ Role selection → Client or Freelancer
3️⃣ Clients post projects → Add title, budget, duration
4️⃣ Freelancers view projects → Filter by skills or budget
5️⃣ Freelancers submit proposals → Price & description
6️⃣ Clients manage proposals → Accept / Reject
7️⃣ Profile management → Bio, Skills, Hourly rate, Portfolio
