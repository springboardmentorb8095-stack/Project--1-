# TalentLink: Full-Stack Freelance Marketplace

TalentLink is a comprehensive, full-stack web application designed to connect clients with talented freelancers. Built with a **React.js** frontend and a **Django REST Framework** backend, this platform facilitates the entire project lifecycle—from project posting and proposal submission to contract management, milestone-based payments, and secure communication.

This project successfully implements 100% of the core features outlined in the `TalentLink.pdf` requirements and goes significantly beyond the original scope by integrating a complete financial system, which was explicitly excluded from the initial plan.

## 🛠 Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router, React Context API, Axios, React-Bootstrap, Vite |
| **Backend** | Python, Django, Django REST Framework (DRF) |
| **Database** | PostgreSQL (Production), SQLite (Development) |
| **Authentication** | JWT (djangorestframework-simplejwt) |
| **Financials** | `xhtml2pdf` (for PDF invoice generation) |
| **Notifications** | Django Signals, HTML Email Templates |
| **Deployment** | Gunicorn, Whitenoise, dj-database-url |

---

## 🚀 Core Features

All features from the 8-week project plan were successfully implemented.

### **Milestone 1: Authentication & User Setup**
* **Secure User Authentication:** A robust system for user registration, login, and token-based (JWT) session management.
* **Role-Based Access:** Clear distinction between "Client" and "Freelancer" roles, with unique permissions and dashboard views for each.
* **User Profiles:** Users can create and manage their personal profiles, including bios, profile pictures, and skills.

### **Milestone 2: Projects, Proposals & Portfolios**
* **Freelancer Portfolios:** Freelancers can create and manage a dedicated portfolio to showcase their past work and skill sets.
* **Project Posting & Search:** Clients can post, update, and manage detailed project listings. A powerful search and filter API allows freelancers to find projects matching their skills and budget.
* **Proposal System:** Freelancers can submit detailed proposals for projects, which clients can then review, accept, or reject.

### **Milestone 3: Contracts, Messaging & Notifications**
* **Automated Contract Flow:** When a client accepts a proposal, a formal contract is automatically generated, and its status is tracked throughout the project lifecycle.
* **In-App Messaging:** A real-time, private messaging system allows clients and freelancers to communicate directly and securely within the platform.
* **Dual Notification System:** A comprehensive notification system alerts users to key events (like new messages or proposal status changes) via:
    1.  **In-App Notifications** (with an audio alert).
    2.  **Automated Email Notifications** (using HTML templates for a professional look).
* **Reviews & Ratings:** A two-way review system allows clients and freelancers to leave ratings and feedback for each other after a contract is completed.

### **Milestone 4: Dashboards & Deployment**
* **Role-Based Dashboards:** Both clients and freelancers have a custom dashboard providing an at-a-glance overview of their active projects, proposals, contracts, and key analytics.
* **Production-Ready Configuration:** The application is fully configured for a production environment, including settings for a production server (Gunicorn), static file handling (Whitenoise), and environment variable management.

---

## 🎁 Extra Features (Beyond PDF Scope)

This project includes a significant number of advanced features that were **not** part of the original PDF plan, transforming it from a simple matchmaking site into a full-fledged business platform.

* **Complete Financial System:**
    * **User Wallets:** Every user has a personal wallet to hold and manage funds.
    * **Transaction Ledger:** All financial movements (deposits, payments, withdrawals) are tracked in a secure, immutable transaction log.

* **Milestone-Based Payments:**
    * This is the core of the financial system. Clients can break large projects into smaller, manageable **Milestones** with individual budgets and deadlines.
    * This provides security for the client (who only pays for approved work) and clarity for the freelancer (who has a clear set of deliverables).

* **PDF Invoice Generation:**
    * The system automatically generates a formal **Invoice** for each funded milestone.
    * Clients and freelancers can download a professional, multi-page **PDF invoice** for their records at any time.

* **Project File Attachments:**
    * Users can upload and attach files (e.g., design briefs, code samples, final deliverables) directly to their projects.

* **Automated Deadline Reminders:**
    * A backend script is included to automatically email freelancers about approaching project deadlines, helping to keep projects on track.

* **"Save for Later" Feature:**
    * Freelancers can "save" projects they are interested in to a personal list, allowing them to review and apply for them at a later time.

---

## ✅ Conclusion

TalentLink successfully implements 100% of the core features outlined in the project requirements. Furthermore, it goes significantly beyond the original scope by designing and integrating a complete, end-to-end financial and milestone management system—a feature set explicitly excluded from the initial plan.

The result is a robust, secure, and professional-grade application that demonstrates a deep understanding of full-stack development, complex database design, and real-world user needs.