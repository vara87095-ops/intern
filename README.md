# 🚀 ProjectHub — Full-Stack Project Showcase & Manager

A modern, production-ready full-stack web application designed for developer portfolio and project management. Built to demonstrate clean architecture and seamless integration between **Frontend**, **Backend**, and **Database**, ready for instant local testing and cloud deployment.

![ProjectHub Architecture](https://img.shields.io/badge/Architecture-MERN%20%2F%20Full%20Stack-indigo?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-MongoDB%20%2F%20Cloud%20Ready-emerald?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%7C%20Render%20%7C%20Netlify-black?style=for-the-badge)

---

## 🎯 Project Overview & Features

- **Frontend (Client)**:
  - Built with **React 18** and **Vite** for lightning-fast HMR and bundle optimization.
  - Interactive Project Showcase with category filtering (`Full Stack`, `Frontend`, `Backend`, `AI/ML`, `Cloud`, `IoT`).
  - Real-time search across titles, descriptions, and technology tags.
  - Live **Statistics Dashboard** showing total projects, completion breakdown, and top technologies.
  - Responsive Modal for **CRUD Operations** (Create, Read, Update, Delete) with live validation.
  - Real-time API and Database connectivity health badge.

- **Backend (Server)**:
  - **Node.js** with **Express.js** RESTful API.
  - Modular architecture: Models, Controllers, Routes, and Database configuration.
  - Comprehensive input validation and error handling.
  - Aggregated metrics calculations (`/api/projects/stats`).

- **Database**:
  - **MongoDB Atlas** cloud connectivity via **Mongoose**.
  - **Zero-Config Local Fallback**: Includes a built-in persistent storage engine so you can run, test, and present the application immediately out of the box without needing local MongoDB installed!
  - When `MONGODB_URI` is provided, it automatically switches to live MongoDB seamlessly.

- **Hosting & Deployment Ready**:
  - Pre-configured deployment manifests: [`vercel.json`](./vercel.json) for Vercel and [`render.yaml`](./render.yaml) for Render.

---

## 📁 Repository Structure

```
intern/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatsBanner.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ProjectModal.jsx
│   │   ├── services/
│   │   │   └── api.js          # Centralized API service
│   │   ├── App.jsx             # Main Application Logic
│   │   ├── main.jsx            # React DOM Entry
│   │   └── index.css           # Modern Design System styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy
├── server/                     # Backend REST API (Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Database connection & adapter
│   │   ├── controllers/
│   │   │   └── projectController.js # CRUD & Stats logic
│   │   ├── models/
│   │   │   └── Project.js      # Unified Mongoose & Persistent Model
│   │   ├── routes/
│   │   │   └── projectRoutes.js     # API Route declarations
│   │   ├── data/
│   │   │   └── seedData.js     # Starter sample projects
│   │   └── server.js           # Express App initialization
│   ├── .env.example            # Environment variables template
│   └── package.json
├── vercel.json                 # Vercel unified deployment config
├── render.yaml                 # Render infrastructure config
├── package.json                # Monorepo scripts
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Install Dependencies
Run the command below from the project root:

```powershell
# Install backend and frontend dependencies
npm run install:all
```

Alternatively, install each individually:
```powershell
cd server
npm install
cd ../client
npm install
```

### 2. Configure Environment Variables
Inside `server/`, create or inspect `.env`:
```env
PORT=5000
NODE_ENV=development
# Optional: Paste your MongoDB Atlas URI here.
# If left blank, it automatically uses the local persistent database!
MONGODB_URI=
```

### 3. Start the Backend API
In a terminal:
```powershell
npm run dev:server
```
*API will start on `http://localhost:5000`.*

### 4. Start the Frontend
In a second terminal:
```powershell
npm run dev:client
```
*Frontend will launch on `http://localhost:3000`.*

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects/health` | Check backend & database connection status |
| `GET` | `/api/projects/stats` | Compute aggregated project & technology statistics |
| `GET` | `/api/projects` | List projects (supports `?search=`, `?category=`, `?status=`) |
| `GET` | `/api/projects/:id` | Retrieve single project details |
| `POST` | `/api/projects` | Create a new project (JSON body) |
| `PUT` | `/api/projects/:id` | Update project fields (JSON body) |
| `DELETE` | `/api/projects/:id` | Delete a project by ID |

### Sample JSON Payload for `POST /api/projects`:
```json
{
  "title": "Smart AI Code Reviewer",
  "description": "An automated bot analyzing pull requests for security and performance.",
  "category": "AI/ML",
  "techStack": ["React", "FastAPI", "OpenAI", "Docker"],
  "repoUrl": "https://github.com/example/ai-reviewer",
  "liveUrl": "https://ai-reviewer.onrender.com",
  "status": "In Progress"
}
```

---

## ☁️ Setting Up Cloud Database (Free MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (username and password).
4. Under **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** -> **Drivers (Node.js)** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/projecthub?retryWrites=true&w=majority
   ```
6. Add it to `server/.env` as `MONGODB_URI=...` or in your hosting provider's Environment Variables.

---

## 🚀 Live Cloud Deployment

### Option A: Deploy on Vercel (Recommended)
1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of ProjectHub"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. In **Environment Variables**, add:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
5. Click **Deploy**. Vercel will build both the React frontend and Express serverless backend using [`vercel.json`](./vercel.json)!

### Option B: Deploy on Render
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com/) and click **New > Blueprint**.
3. Connect your repository. Render will automatically read [`render.yaml`](./render.yaml) and configure both the Web Service (backend) and Static Site (frontend).
4. Supply your `MONGODB_URI` in the dashboard settings.

### Option C: Deploy Frontend to Netlify
1. Build the client locally: `npm run build`.
2. Connect your repo on [Netlify](https://www.netlify.com/).
3. Set Build command: `npm --prefix client install && npm --prefix client run build`.
4. Set Publish directory: `client/dist`.
5. Under Environment variables, add `VITE_API_URL` pointing to your deployed backend URL.
