# Library Portal - MERN Stack Project

> A modern, clean, and beginner-friendly **Library Management & Lending Portal** built with **MongoDB**, **Express.js**, **React**, and **Node.js** (MERN) styled with **Bootstrap 5**.

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Technology Stack](#technology-stack)
5. [Folder Structure](#folder-structure)
6. [Quick Start & Setup Guide](#quick-start--setup-guide)
7. [Demo Login Credentials](#demo-login-credentials)
8. [REST API Endpoints](#rest-api-endpoints)
9. [Unique Feature: Debounced Search Explained](#unique-feature-debounced-search-explained)
10. [College Viva Voce & Interview Q&A](#college-viva-voce--interview-qa)

---

## 🌟 Project Overview

**Library Portal** is an end-to-end web application designed to digitize library workflows. It allows readers (Members) to discover books, check availability in real time, and borrow titles. Librarians and Administrators have access to powerful tools to manage the catalog, oversee circulation, track overdue returns with automatic fine calculation, and manage member accounts.

---

## 🚀 Key Features

- **Live Debounced Search**: Fast, responsive search by Title, Author, or ISBN that waits until the user finishes typing before querying the database, eliminating unnecessary server load.
- **Category Pill Filtering**: One-click filtering by genres (e.g., Computer Science, Literature & Fiction, Science & History, Self Help).
- **Automated Inventory Tracking**: Whenever a book is borrowed or returned, available copy counts automatically update in MongoDB.
- **Circulation & Loan Lifecycle**: Tracks issue dates, due dates (default 14 days), return dates, and flags overdue books with calculated daily fines.
- **Role-Aware Dashboards**:
  - **Member Dashboard**: Displays currently borrowed books, due dates, overdue warnings, and personal loan history.
  - **Staff Dashboard**: Summarizes total titles, circulating copies, overdue counts, total members, and recent lending transactions.
- **In-App Notifications**: Alerts members automatically when a book is issued, due soon, or overdue.
- **1-Click Demo Login**: Pre-configured buttons on the login page to easily test the Admin, Librarian, and Member roles during project evaluation and demos.

---

## 👥 User Roles & Permissions

| Feature | Member | Librarian | Admin |
| :--- | :---: | :---: | :---: |
| Browse & View Catalog | ✅ | ✅ | ✅ |
| Debounced Search & Category Filter | ✅ | ✅ | ✅ |
| Borrow Books (Self-service) | ✅ | ✅ | ✅ |
| View Personal Borrowing History | ✅ | ✅ | ✅ |
| Update Personal Profile | ✅ | ✅ | ✅ |
| Issue Book to Any Member | ❌ | ✅ | ✅ |
| Process Book Returns | ❌ | ✅ | ✅ |
| Add / Edit Books | ❌ | ✅ | ✅ |
| Delete Books from Catalog | ❌ | ❌ | ✅ |
| View & Manage Member Accounts | ❌ | ✅ | ✅ |
| Delete Members / Loans | ❌ | ❌ | ✅ |

---

## 💻 Technology Stack

- **Frontend**:
  - React 18 (Functional Components, Hooks: `useState`, `useEffect`, `useContext`)
  - React Router DOM 6 (Client-side routing and protected routes)
  - Axios (HTTP client with JWT request/response interceptors)
  - Bootstrap 5 & Bootstrap Icons (Modern, responsive UI without heavy frameworks)
  - Vite (Fast development and build tool)
- **Backend**:
  - Node.js & Express.js (RESTful API architecture)
  - MongoDB & Mongoose (NoSQL database, schema validation, population)
  - JSON Web Tokens (JWT) (Stateless authentication)
  - bcryptjs (Secure one-way password hashing)
  - CORS & Dotenv (Cross-origin support & environment configurations)

---

## 📁 Folder Structure

```text
Library platform/
├── client/                      # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, Footer, ProtectedRoute, StatCard)
│   │   ├── context/             # AuthContext (global user state & login/logout)
│   │   ├── hooks/               # useDebounce (custom hook for search performance)
│   │   ├── pages/               # Application Pages
│   │   │   ├── Home.jsx         # Landing page with hero & highlights
│   │   │   ├── Login.jsx        # Login page with 1-click demo buttons
│   │   │   ├── Register.jsx     # Member registration form
│   │   │   ├── Dashboard.jsx    # Role-based dashboard
│   │   │   ├── BooksList.jsx    # Catalog with search & category filters
│   │   │   ├── BookDetails.jsx  # Detailed book info & borrow button
│   │   │   ├── BookForm.jsx     # Add/Edit book form (Staff)
│   │   │   ├── LoansList.jsx    # Circulation & loan management
│   │   │   ├── MembersList.jsx  # Member management directory
│   │   │   └── Profile.jsx      # Profile settings & loan history
│   │   ├── services/            # api.js (Axios instance with Bearer token)
│   │   ├── App.jsx              # Routes & navigation structure
│   │   ├── main.jsx             # React DOM entry point
│   │   └── index.css            # Custom CSS enhancements
│   ├── package.json
│   └── vite.config.js           # Vite dev server & proxy settings
│
├── server/                      # Express Backend API
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── controllers/             # Business logic controllers
│   │   ├── authController.js    # Register, login, profile
│   │   ├── bookController.js    # Book catalog CRUD, search, filter
│   │   ├── memberController.js  # Member directory CRUD
│   │   ├── loanController.js    # Book checkout, return, fine calculation
│   │   ├── dashboardController.js# Aggregated metrics for dashboards
│   │   └── notificationController.js# Member alerts
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & role authorization
│   ├── models/                  # Mongoose data schemas
│   │   ├── User.js              # User & Member accounts
│   │   ├── Book.js              # Book inventory
│   │   ├── Loan.js              # Borrowing & circulation records
│   │   └── Notification.js      # User notifications
│   ├── routes/                  # Express route definitions
│   ├── seed.js                  # Database seeder with sample books & users
│   ├── .env                     # Server environment variables
│   ├── package.json
│   └── server.js                # Express entry point
│
├── package.json                 # Root script to run both servers concurrently
└── README.md                    # Project documentation
```

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) installed locally (running as a service) or a free MongoDB Atlas connection string.

### 2. Install Dependencies
Open a terminal in the project root directory and run:
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```
*(Or navigate into `server` and run `npm install`, then into `client` and run `npm install`)*

### 3. Seed Sample Data
Populate MongoDB with realistic starter data (sample users, 10 popular books, and active loans):
```bash
npm run seed
```
Output:
```text
Connected to MongoDB for seeding: mongodb://127.0.0.1:27017/library_portal
Users seeded successfully.
Seeded 10 books successfully.
Seeded sample loans successfully.
Seeded notifications successfully.
```

### 4. Run the Application
Start both the backend server (Port 5000) and the React frontend (Port 5173):
```bash
npm run dev
```

Open your browser and navigate to:
**http://localhost:5173**

---

## 🔑 Demo Login Credentials

The login page contains **1-Click Quick Fill buttons** for effortless testing during evaluations. Alternatively, type:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@library.com` | `admin123` |
| **Librarian** | `librarian@library.com` | `librarian123` |
| **Member** | `member@library.com` | `member123` |

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new member
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/profile` - Get logged-in user profile *(Protected)*
- `PUT /api/auth/profile` - Update profile information *(Protected)*

### Books (`/api/books`)
- `GET /api/books` - List books with search, category filter, and sort options
- `GET /api/books/categories` - Get distinct book categories
- `GET /api/books/:id` - Get details of a specific book
- `POST /api/books` - Add a new book *(Staff: Librarian, Admin)*
- `PUT /api/books/:id` - Update book details *(Staff: Librarian, Admin)*
- `DELETE /api/books/:id` - Remove a book *(Admin only)*

### Loans / Lending (`/api/loans`)
- `GET /api/loans` - View all active, overdue, and returned loans *(Staff)*
- `GET /api/loans/my` - View current user's borrowed books *(Member)*
- `POST /api/loans` - Issue a book to a member
- `PUT /api/loans/:id/return` - Return a borrowed book & compute fines
- `DELETE /api/loans/:id` - Delete a loan record *(Admin)*

### Members (`/api/members`)
- `GET /api/members` - List registered members *(Staff)*
- `POST /api/members` - Register a member manually *(Staff)*
- `GET /api/members/:id` - View member details & active loans *(Staff)*
- `PUT /api/members/:id` - Update member status or role *(Staff)*
- `DELETE /api/members/:id` - Delete member account *(Admin)*

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard` - Get role-specific metrics & recent activity *(Protected)*

---

## 🔍 Unique Feature: Debounced Search Explained

In standard web forms, typing in a search bar triggers an event on every keystroke. If a user types "JavaScript" (10 letters), the app would fire 10 simultaneous API requests to the database, causing server lag and UI jitter.

### How Debouncing Solves This:
The project implements a custom React hook: [`client/src/hooks/useDebounce.js`](file:///c:/Users/Jeevan%20Karthick/OneDrive/文档/Library%20platform/client/src/hooks/useDebounce.js):
```javascript
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer for 400 milliseconds
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the user types another character before 400ms expires, cancel the previous timer
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```
**Benefit**: The database query is sent only once after the user stops typing for 400ms, reducing server requests by up to 90%.

---

## 🎓 College Viva Voce & Interview Q&A

Use these explanations when presenting your final project to professors or interviewers:

#### Q1: What is the MERN stack and why did you choose it?
> **Answer**: MERN stands for **MongoDB, Express.js, React.js, and Node.js**. It enables developing a full-stack application using a single language—**JavaScript**—across both client and server. This makes data exchange seamless via JSON, accelerates development, and provides a modern single-page application (SPA) user experience.

#### Q2: How is security handled for passwords and API routes?
> **Answer**:
> 1. Passwords are never stored in plain text. Before saving to MongoDB, a Mongoose `pre('save')` hook hashes them using **bcryptjs** with 10 salt rounds.
> 2. API security uses **JSON Web Tokens (JWT)**. On login, the server signs a token containing the user's ID. The client sends this token in the HTTP `Authorization: Bearer <token>` header.
> 3. An Express middleware (`protect`) verifies the signature and attaches the user object to `req.user`.

#### Q3: How is Role-Based Access Control (RBAC) implemented?
> **Answer**: In `authMiddleware.js`, we have an `authorize(...roles)` higher-order middleware. For example, `router.post('/', protect, authorize('Librarian', 'Admin'), createBook)` ensures that standard Members cannot add or delete books, while Librarians and Admins can. On the frontend, React Router uses `<ProtectedRoute allowedRoles={['Librarian', 'Admin']}>` to restrict access to sensitive views.

#### Q4: How does book copy tracking work when lending and returning?
> **Answer**: In `loanController.js`, when a book is issued:
> 1. The controller checks `availableCopies > 0`.
> 2. It creates a `Loan` document linking `book` and `member` via MongoDB ObjectIds.
> 3. It decrements `availableCopies` by 1 using `book.availableCopies -= 1; await book.save();`.
> 4. When returned, `availableCopies` is incremented back.

#### Q5: What is Mongoose Population?
> **Answer**: In NoSQL databases like MongoDB, documents don't have traditional SQL joins. Mongoose provides the `.populate('book member')` method which automatically looks up the referenced ObjectIds in the `books` and `users` collections and replaces the ID with the actual document data.

---

## 📄 License
This project is open-source and created for educational purposes. Feel free to use and adapt it for academic demonstrations!
