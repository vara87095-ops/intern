# 🚀 TaskFlow & ProjectHub — Full-Stack Application

A modern, production-grade full-stack web application designed for developer task management, real-time team collaboration, and portfolio project showcase. Built to demonstrate clean architecture, robust API integration, stateless JWT authentication, and dynamic data handling with WebSockets.

![Architecture](https://img.shields.io/badge/Architecture-Full%20Stack%20%7C%20REST%20%2B%20WebSockets-indigo?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green?style=for-the-badge)
![Real-Time](https://img.shields.io/badge/Real--Time-Socket.io%20WebSockets-orange?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-JWT%20%2B%20Bcrypt-red?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Zero--Config%20Store-emerald?style=for-the-badge)

---

## 🎯 Core Features & Requirements

### 1. 🔐 User Authentication & Authorization
- **Cryptographic Security**: Passwords are securely salted and hashed using `bcryptjs` (10 rounds) before persistence. Plaintext passwords never enter storage.
- **Stateless Session Tokens**: JSON Web Tokens (JWT) signed with expiration (7 days).
- **Protected Endpoints & Middleware**:
  - `protect`: Extracts and validates `Bearer <token>` from the HTTP `Authorization` header, looks up user profile, and attaches `req.user`.
  - `authorize(...roles)`: Role-Based Access Control (RBAC) ensuring only designated roles (e.g. `admin` vs `member`) can perform privileged actions.
- **Instant 1-Click Demo Logins**: Includes pre-seeded accounts in the UI so anyone evaluating the project can log in with a single click without typing:
  - 👑 **Demo Admin**: `alex@demo.com` / `password123`
  - 👩‍💻 **Demo Member**: `sarah@demo.com` / `password123`

### 2. 📋 Full CRUD Operations for Tasks
- **Task Schema**:
  - `title`: Task summary (required).
  - `description`: Detailed context and acceptance criteria.
  - `status`: State machine transition across `To Do` ➔ `In Progress` ➔ `In Review` ➔ `Done`.
  - `priority`: `Low`, `Medium`, `High`, `Urgent` (with visual badges and glow indicators).
  - `dueDate`: Due date with automatic overdue warning styling.
  - `tags`: Tag/label chips.
  - `assignedTo`: Team member attribution (initials avatar, name, email).
  - `createdBy`: Creator audit reference.
- **RESTful Endpoints**:
  - `GET /api/tasks`: Multi-parameter query filtering (`search`, `status`, `priority`, `assignedTo`, `sortBy`, `order`).
  - `GET /api/tasks/:id`: Retrieve single task details.
  - `POST /api/tasks`: Create new task (protected, automatically assigns creator).
  - `PUT /api/tasks/:id`: Full update of task attributes (protected).
  - `PATCH /api/tasks/:id/status`: Fast status transition for 1-click status moves.
  - `DELETE /api/tasks/:id`: Delete task (protected).
  - `GET /api/tasks/stats`: Aggregated sprint metrics (total, by status, by priority, overdue count, completion rate %).

### 3. ⚡ Real-Time Updates via WebSockets (Socket.io)
- **Bi-Directional Event Streaming**:
  - Integrated HTTP server + `socket.io` instance.
  - `task:created`: Broadcasts newly created task to all connected clients.
  - `task:updated`: Broadcasts edits or status advances across all open browser tabs/windows.
  - `task:deleted`: Broadcasts deleted task ID to prune local state instantly.
  - `users:count`: Broadcasts live active connection count.
- **Client Synchronization**:
  - Custom `useSocket` hook handles connection lifecycle, reconnects, and event merging.
  - Real-time connection badge in the header: `🟢 Real-Time (X online)`.
  - Live toast banner on multi-user actions (e.g. *"Sarah moved 'WebSocket Gateway' to Done"*).

### 4. 📱 Responsive Design for Web and Mobile
- **Dual Work Views**:
  - **Kanban Board View**: 4 columns (`To Do`, `In Progress`, `In Review`, `Done`) with quick status-advance buttons and mobile column tabs.
  - **Task List View**: Dense, sortable table layout with inline status change dropdowns.
  - **Project Showcase View**: Preserves the original portfolio project showcase.
- **Mobile Optimizations**:
  - Mobile column navigation tabs (switch between Kanban columns effortlessly with your thumb).
  - Slide-out mobile navigation drawer with hamburger trigger.
  - Floating Action Button (FAB) on mobile screens for rapid task creation.
  - Touch-friendly tap targets (minimum 44x44px) and smooth glassmorphic styling.

### 5. 📖 Interactive Architecture & Learning Guide
- Click the **"Architecture Guide"** button in the header or footer to view an interactive modal detailing:
  - Full-stack client-server monorepo layout.
  - JWT auth lifecycle and header injection.
  - WebSocket event loop mechanics.
  - REST API patterns and error handling.

---

## 📁 Repository Structure

```
intern/
├── client/                     # Frontend Application (React 18 + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AuthModal.jsx        # Login / Register / 1-Click Demo
│   │   │   ├── KanbanBoard.jsx      # 4-Column responsive board + mobile tabs
│   │   │   ├── TaskListView.jsx     # Dense responsive table view
│   │   │   ├── TaskModal.jsx        # Create/Edit task modal
│   │   │   ├── TaskFilterBar.jsx    # Search, status/priority filters, view toggles
│   │   │   ├── TaskStatsBanner.jsx  # Sprint metrics & progress bar
│   │   │   ├── LearningModal.jsx    # Interactive architectural guide
│   │   │   ├── Navbar.jsx           # Responsive header + mobile drawer
│   │   │   ├── ProjectCard.jsx      # Project showcase card
│   │   │   ├── ProjectModal.jsx     # Project showcase modal
│   │   │   └── StatsBanner.jsx      # Project showcase stats
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # JWT Auth state & token storage
│   │   │   └── SocketContext.jsx    # Socket.io connection & events
│   │   ├── services/
│   │   │   └── api.js               # Centralized fetch client with Auth headers
│   │   ├── App.jsx                  # Main Application logic & view router
│   │   ├── main.jsx                 # Entrypoint with context providers
│   │   └── index.css                # Responsive glassmorphism design system
│   ├── package.json
│   └── vite.config.js               # Vite config with API & WebSocket proxy
├── server/                     # Backend REST API & WebSocket Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # Dual database adapter (Mongo + Local JSON)
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, Login, Me, Team Users
│   │   │   ├── taskController.js    # Task CRUD, status, stats + Socket emits
│   │   │   └── projectController.js # Project showcase CRUD
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT verification & RBAC authorization
│   │   ├── models/
│   │   │   ├── User.js              # Mongoose User + Local persistent user store
│   │   │   ├── Task.js              # Mongoose Task + Local persistent task store
│   │   │   └── Project.js           # Mongoose Project + Local persistent store
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth routes
│   │   │   ├── taskRoutes.js        # /api/tasks routes
│   │   │   └── projectRoutes.js     # /api/projects routes
│   │   ├── socket/
│   │   │   └── socketHandler.js     # Socket.io connections & event broadcasters
│   │   ├── data/
│   │   │   ├── seedTasks.js         # Starter tasks across all stages
│   │   │   └── seedData.js          # Starter projects
│   │   └── server.js                # Express + HTTP + Socket.io Server
│   ├── test_api.mjs                 # Automated full-stack integration test suite
│   └── package.json
├── package.json                # Monorepo root scripts
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
From the project root:
```powershell
npm run install:all
```

### 2. Run Automated Integration Tests
Verify that all authentication, task CRUD, and frontend-serving endpoints pass:
```powershell
npm --prefix server test
```

### 3. Start Development Servers
Run the backend and frontend concurrently:

**Terminal 1 (Backend):**
```powershell
npm run dev:server
# Server starts on http://localhost:5000 with WebSockets on ws://localhost:5000
```

**Terminal 2 (Frontend):**
```powershell
npm run dev:client
# Vite dev server opens on http://localhost:3000 (proxies /api and /socket.io to backend)
```

Alternatively, build the client and run single-service production mode:
```powershell
npm run build
npm start
# Visit http://localhost:5000 directly!
```

---

## 🧪 Testing Real-Time WebSockets
1. Open the application in two separate browser tabs or windows side-by-side (`http://localhost:3000`).
2. Notice the real-time indicator pill shows `🟢 Real-Time (2 online)`.
3. In Tab A, click **"+ New Task"** or click the move arrow `➔` on a task card.
4. Observe Tab B update **instantaneously without any page refresh**, accompanied by a real-time notification alert!

---

## 🔑 Pre-Configured Demo Accounts
| Role | Email | Password |
|---|---|---|
| **Admin** | `alex@demo.com` | `password123` |
| **Member** | `sarah@demo.com` | `password123` |
| **Member** | `david@demo.com` | `password123` |

*(You can also register any new account directly in the Sign In / Register dialog!)*
