# OnCall Home 🏠

OnCall Home is a desktop-based home service booking platform that connects customers with skilled home service professionals such as plumbers, electricians, painters, carpenters, and cleaners.

The application is built with **Electron.js** for the desktop user interface, **Node.js + Express** for the backend API, and **MySQL** for data storage. The backend API and database are deployed on **Railway**, while the source code is managed with **GitHub**.

## Author

**Shahriar Kabir**

## Features

### Customer

* User registration and login
* Browse home service categories
* Find workers by service category
* Create service bookings
* View personal bookings
* View worker information and service price
* Submit ratings and reviews for completed bookings
* Logout

### Worker

* Worker registration and login
* Set profession and service rate
* View assigned customer bookings
* Accept bookings
* Reject bookings
* Complete accepted bookings
* View customer reviews
* Logout

### Admin

* Admin login
* View system bookings
* Monitor users and service activity
* Manage the overall platform through the admin dashboard

## Technology Stack

| Layer             | Technology              |
| ----------------- | ----------------------- |
| Desktop UI        | Electron.js             |
| Frontend          | HTML5, CSS3, JavaScript |
| Backend API       | Node.js, Express.js     |
| Database          | MySQL                   |
| Database Hosting  | Railway MySQL           |
| API Hosting       | Railway                 |
| Version Control   | GitHub                  |
| Local Development | Node.js, npm, VS Code   |

## System Architecture

```text
┌──────────────────────────────┐
│       Electron Desktop       │
│  HTML + CSS + JavaScript     │
└──────────────┬───────────────┘
               │ HTTPS / API
               ▼
┌──────────────────────────────┐
│       Railway API Server     │
│       Node.js + Express      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         Railway MySQL        │
│   Users / Services /         │
│   Bookings / Reviews         │
└──────────────────────────────┘
```

## Project Structure

```text
OnCall-Home/
│
├── backend/
│   ├── auth.js
│   ├── booking.js
│   ├── database.js
│   ├── review.js
│   └── service.js
│
├── database/
│   └── database files / SQL scripts
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── worker.html
│   ├── admin.html
│   ├── my-bookings.html
│   ├── workers.html
│   ├── renderer.js
│   └── style.css
│
├── server/
│   └── server.js
│
├── main.js
├── preload.js
├── package.json
├── package-lock.json
└── README.md
```

## Backend API

The deployed API is hosted on Railway:

```text
https://on-call-home-project-production.up.railway.app
```

Basic health-check endpoint:

```text
GET /
```

Example response:

```json
{
  "success": true,
  "message": "OnCall Home API is running"
}
```

## Main API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Services

```text
GET /api/services/categories
GET /api/services/workers?category=<category>
```

### Bookings

```text
POST  /api/bookings
GET   /api/bookings/user/:userId
GET   /api/bookings/worker/:workerId
PATCH /api/bookings/:bookingId/status
GET   /api/bookings/admin
```

### Reviews

```text
POST /api/reviews
GET  /api/reviews/worker/:workerId
```

## Database

The application uses MySQL with the following main entities:

* Users
* Services
* Bookings
* Reviews

The production API connects to Railway MySQL using environment variables such as:

```text
MYSQLHOST
MYSQLPORT
MYSQLUSER
MYSQLPASSWORD
MYSQLDATABASE
```

Do **not** commit database passwords, API secrets, or other private credentials to GitHub.

## Installation and Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/shahriarkabir07/on-call-home-Project.git
cd on-call-home-Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the Electron application

```bash
npm start
```

The Electron desktop application will open automatically.

## Production Architecture

The production application uses Railway for the server-side components:

```text
GitHub Repository
       │
       ▼
Railway Node.js / Express API
       │
       ▼
Railway MySQL Database
       ▲
       │
Electron Desktop Application
```

## Development Notes

* XAMPP is not required when using the deployed Railway API and Railway MySQL setup.
* The Electron application communicates with the deployed API rather than connecting directly to the production database.
* The `backend/` modules contain the core business/database logic used by the server.
* The `server/server.js` file exposes the HTTP API used by the Electron application.

## Security Notes

* Never commit `.env` files containing real passwords or secrets.
* Never expose database credentials in frontend JavaScript.
* Use environment variables for production database configuration.
* Keep production credentials private.

## Future Improvements

* Package the Electron application into a Windows installer
* Add stronger authentication/session management
* Add password reset functionality
* Improve notification and messaging features
* Add more advanced admin analytics
* Improve automated testing and error logging

## Project Status

The project currently includes a working Electron desktop interface, Railway-hosted Express API, Railway MySQL database integration, authentication, service browsing, booking management, ratings/reviews, worker management, and admin functionality.


