# On-Call Home Service Management System

A full-stack, role-based platform designed to connect customers with home service workers and administrative management. The system streamlines service booking, worker allocation, and service category management.

---

## 👤 Author

**Shahriar Kabir**
- GitHub: [@shahriarkabir07](https://github.com/shahriarkabir07)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (XAMPP / MariaDB)
- **Database Client:** `mysql2` (Promise-based connection pool)
- **Middleware:** `cors`, `dotenv`
- **Version Control:** Git, GitHub

---

## 📂 Project Architecture

```text
on-call-home-Project/
├── backend/            # Express REST API & Database Configurations
│   ├── src/
│   │   └── config/     # Database Connection (db.js)
│   └── server.js       # Entry point for backend server
├── database/           # Relational Database Schemas
│   └── schema.sql      # MySQL Table Definitions & Constraints
├── frontend/           # Client Web Application (In Progress)
├── desktop/            # Desktop Management Suite (In Progress)
└── docs/               # Architecture Diagrams & Project Specs

🛢️ Database Schema Highlights
The database (oncall_home) enforces relational integrity using foreign key constraints across primary tables:

users: Stores user profiles for three roles (CUSTOMER, WORKER, ADMIN).

service_categories: Manages available home service offerings.

bookings: Handles service requests linking customers and assigned workers, complete with relational foreign key cascading.

🚀 Getting Started
Prerequisites
Node.js (v18+)

XAMPP / WAMP (MySQL Service active on port 3306)

1. Database Setup
Start MySQL via XAMPP Control Panel.

Open http://localhost/phpmyadmin.

Execute the SQL statements inside database/schema.sql.

2. Backend Setup
Navigate to the backend directory:

Bash
cd backend
Install dependencies:

Bash
npm install
Start the development server:

Bash
node server.js
Verify server running at http://localhost:3000/api/test.

📝 License
Distributed under the ISC License.


---

### **Steps to complete in Codex:**

1. Click inside Codex, press **`Ctrl + A`** to select all, then paste (**`Ctrl + V`**).
2. Press **`Ctrl + S`** to save, then close Codex.
3. In PowerShell, run these 3 commands to push to GitHub:

```powershell
git add README.md
git commit -m "Update README with author details"
git push origin main
