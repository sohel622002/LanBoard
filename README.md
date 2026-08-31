# Project Vault

Local-first desktop project management application for teams. An admin hosts project data on a local PostgreSQL database while team members connect over the LAN — with Kanban boards, real-time updates, and cloud-based account authentication.

Built with **Electron**, **React**, **Node.js**, and **PostgreSQL**.

---

## Features

- **Kanban project boards** — Custom stages, drag-and-drop tasks, assignees, priorities, and due dates
- **Local-first architecture** — Project data stays on the admin's machine, not in the cloud
- **LAN team connectivity** — Bonjour (mDNS) service discovery plus manual IP connection
- **Real-time collaboration** — Live board updates via Socket.IO
- **Dual-database design** — Supabase for cloud auth, local PostgreSQL for projects and tasks
- **Guided setup** — Download and initialize embedded PostgreSQL binaries on first run
- **Windows desktop app** — Packaged with Electron Builder (NSIS installer)

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Desktop | Electron, Electron Builder |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Radix UI, TanStack React Query, React Router, Zod |
| Backend | Node.js, Express.js, TypeScript, Socket.IO, Prisma ORM |
| Database | PostgreSQL (local), Supabase (cloud auth) |
| Auth | JWT, bcrypt |
| Networking | Bonjour (mDNS) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Desktop App                  │
│  ┌─────────────────┐         ┌────────────────────────┐ │
│  │  React Frontend │ ◄─────► │  Node.js / Express API │ │
│  └─────────────────┘         └──────────┬─────────────┘ │
└───────────────────────────────────────────┼───────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
            ┌───────▼────────┐                              ┌───────▼────────┐
            │ Local PostgreSQL│                              │ Supabase (Cloud)│
            │ Projects, Tasks │                              │ User Accounts   │
            │ Users, Stages   │                              │ Authentication  │
            └────────────────┘                              └────────────────┘
```

**Admin flow:** Sign up → set up local PostgreSQL → create projects → advertise server on LAN via Bonjour.

**Team member flow:** Sign in → discover or connect to admin server → collaborate on shared projects in real time.

---

## Prerequisites

- **Node.js** 18+
- **npm**
- **Supabase** project (for cloud authentication)
- **Windows** (primary target; backend also supports macOS/Linux for development)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sohel622002/project-vault.git
cd project-vault
```

### 2. Install dependencies

```bash
# Root (Electron)
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables

**`backend/.env`**

```env
PORT=3001
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Supabase (cloud auth)
DATABASE_URL=postgresql://user:password@host:6543/postgres
DIRECT_URL=postgresql://user:password@host:5432/postgres

# Local PostgreSQL
LOCAL_DATABASE_URL=postgresql://postgres:password@localhost:55432/projectvault
```

**`frontend/.env`**

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_ENC_DEC_SECRET_KEY=your_encryption_secret_key
```

> Never commit `.env` files. They are excluded via `.gitignore`.

### 4. Set up the database

```bash
cd backend

# Generate Prisma clients
npm run db:generate

# Push schemas to databases
npm run db:push:supabase
npm run db:push:local
```

### 5. Run in development

Open **three terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev

# Terminal 3 — Electron (from project root)
npm start
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`
- Electron loads the Vite dev server in development mode

---

## Building for Production

```bash
# Build backend
cd backend
npm run build

# Optional: compile backend to Windows executable
npm run build:exe

# Build frontend
cd ../frontend
npm run build

# Package Electron app (from project root)
cd ..
npm run build
```

The installer is output to the `dist/` directory.

---

## Project Structure

```
project-vault/
├── index.js              # Electron main process
├── package.json          # Electron & build config
├── backend/
│   ├── src/
│   │   ├── cloud/        # Supabase auth & Postgres setup
│   │   ├── local/        # Projects, tasks, users, Bonjour, Socket.IO
│   │   └── database/     # Dual Prisma client setup
│   └── prisma/
│       ├── local/        # Local DB schema
│       └── supabase/     # Cloud DB schema
└── frontend/
    └── src/
        ├── api/          # API clients & query keys
        ├── components/   # UI components
        ├── hooks/        # Auth, config, project hooks
        └── pages/        # Routes & views
```

---

## API Overview

| Route prefix | Purpose |
|-------------|---------|
| `/api/cloud/auth` | Cloud signup & login (Supabase) |
| `/api/local/auth` | Local team authentication |
| `/api/postgres` | Download & initialize local PostgreSQL |
| `/api/projects` | Project CRUD |
| `/api/project-stages` | Kanban stage management |
| `/api/project-stage-tasks` | Task management |
| `/api/bonjour` | LAN service discovery |
| `/api/health` | Database health check |

---

## Scripts Reference

### Root

| Command | Description |
|---------|-------------|
| `npm start` | Run Electron app (dev) |
| `npm run build` | Build Windows installer |

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon + ts-node |
| `npm run build` | Compile TypeScript |
| `npm run build:exe` | Build standalone `backend.exe` |
| `npm run db:generate` | Generate Prisma clients |
| `npm run db:push:local` | Push local schema |
| `npm run db:push:supabase` | Push Supabase schema |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## Author

**Sohel Shaikh**

- GitHub: [@sohel622002](https://github.com/sohel622002)
- LinkedIn: [sohelshaikh0602](https://linkedin.com/in/sohelshaikh0602)
- Email: sohelshaikh622002@gmail.com

---

## License

ISC
