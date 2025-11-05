# 🌐 TalentLink

TalentLink is a robust full-stack freelancing platform engineered to streamline collaboration between skilled freelancers and discerning clients. It empowers users to post projects, submit proposals, manage contracts, and communicate—all within a secure, role-based environment. Built using Django for backend logic, React for dynamic frontend interfaces, and AWS for scalable deployment, TalentLink delivers real-time project tracking, intuitive dashboards, and modular workflows. Whether you're a freelancer bidding on opportunities or a client managing multiple projects, TalentLink ensures clarity, speed, and trust at every step.

## 📦 Tech Stack

| Layer      |  Technology        |
|------------|--------------------|
| Frontend   | React (JavaScript) |
| Backend    | Django + DRF       |
| Database   | SQLite (development), PostgreSQL (production-ready)       |
| Auth       | JWT (Token-based)  |
| Messaging  | REST APIs with long-polling  | 

---

## 🔧 Features

### ✅ Task 1: Profile & Project Management
- CRUD operations for client and freelancer profiles
- Project posting with budget, duration, and skill filters
- Dynamic search and filter APIs

### ✅ Task 2: Proposal Workflow
- Freelancers submit proposals with bid amount and timeline
- Clients can view, accept, or reject proposals
- Dashboard views for both roles

### ✅ Task 3: Contract & Messaging
- Auto-generation of contracts from accepted proposals
- Role-based contract status tracking
- Scoped messaging APIs with long-polling frontend integration

---

## Learnings

- Implemented nested serializers and scoped querysets
- Designed responsive UI with conditional rendering
- Integrated real-time feedback using toast notifications
- Practiced Git workflows and collaborative version control
