# Freelancer Web Application

This project is a **Freelancer Website** designed to connect **Clients** and **Freelancers** on a single platform.  
Clients can post their projects, and freelancers can explore, filter, and submit proposals for the projects that match their skills.

The main objective of this project is to build a **full-stack web application** using **React (Frontend)** and **Django with Django REST Framework (Backend)**, implementing all the core functionalities required in a freelancing ecosystem — like authentication, profile management, project posting, and proposal submission.

---

##  Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (JavaScript) |
| **Backend** | Django + Django REST Framework (DRF) |
| **Database** | SQLite / SQL |

---

##  Task 1 — Backend Setup and User Management

1. **Design Database Schema**  
   Defined database models for users, profiles, and projects.

2. **Initialize Django Project with Django REST Framework**  
   Created API structure for REST-based communication.

3. **Set up SQL / SQLite Database**  
   Configured database for development and testing environments.

4. **Implement REST Endpoints for Registration/Login**  
   Created API routes to allow users to:
   - Register (Sign up using username, email, and password)
   - Login (JWT Authentication)

5. **User Profile CRUD Operations**  
   Enabled users to create, read, update, and delete their profiles.

---

## Task 2 — Profile, Projects, and Proposals

1. **Implement Profile Model**  
   Each user (Client or Freelancer) has a dedicated profile with details like bio, skills, and experience.

2. **Project Posting Endpoints (Clients)**  
   Clients can post and manage their projects easily.

3. **Search & Filter APIs (Freelancers)**  
   Freelancers can search and filter projects that fit their expertise.

4. **Proposal Model & Endpoints**  
   Freelancers can send proposals to clients for specific projects.

---

##  Project Overview

| Feature | Status |
|----------|--------|
| Role-based Routing | ✅ Done |
| Proposal Submission | ✅ Done |
| Profile Creation & Editing | ✅ Done |

