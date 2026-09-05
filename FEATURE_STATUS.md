# LanBoard — Feature Status

A plain-English breakdown of what's actually working, what's half-built, and what's missing — based on reading the code (routes, pages, components) and comparing it against `frontend/prd.md`.

## ✅ Completed / Working Features

These have both a backend endpoint and a working frontend UI wired together:

- **Desktop app packaging** — Electron shell that starts the backend automatically ([index.js](index.js))
- **Guided local database setup** — downloads and initializes PostgreSQL automatically on first run ([frontend/src/pages/SetupProcess.tsx](frontend/src/pages/SetupProcess.tsx))
- **LAN discovery** — teammates' computers find the host automatically (Bonjour/mDNS), with manual IP entry as a backup ([frontend/src/pages/AdminConnection.tsx](frontend/src/pages/AdminConnection.tsx))
- **Sign up / log in** — both cloud (Supabase-style) and local login flows
- **Creating a local user** to join an admin's network, with password hashing + JWT
- **Projects** — full create, view, edit, delete
- **Stages (board columns)** — create, edit, delete (new projects get a default "Todo" stage)
- **Tasks** — create, edit title inline, set priority, assign to someone, delete
- **Drag-and-drop Kanban board** — moving tasks between stages, with instant UI feedback and roll-back if the save fails
- **Users list page** — see who's connected (read-only)
- **Health check endpoint** — a way to confirm the backend/database are alive

## 🟡 Half-Built (UI exists, but it doesn't actually do anything yet)

These look finished on screen but are disconnected — buttons with no click handler, inputs with no logic behind them:

- **Search boxes** (sidebar search, project search bar) — you can type, but nothing happens
- **Project filter dropdown** (All / Active / Design) — not wired to anything
- **"New Project" and "+ Filter" buttons** on the project toolbar — code is commented out
- **Edit / Delete / View buttons** on the Users page — icons are there, no click behavior
- **"New User" (invite) button** — no handler, no form
- **"Add Member" button** on a project — commented out
- **Task due dates** — the data field exists in the database, but there's no calendar picker hooked up in the UI, so it can never actually be set
- **Task menu (•••)** — icon shown, does nothing
- **Real-time push updates (Socket.IO)** — the server technology is running, but nothing in the app actually tells it "hey, a task moved" — so if two people are viewing the same board, they won't see each other's changes update live; each person only sees their *own* changes
- **Login/access security** — accounts and passwords work, but the backend doesn't actually check the login token on most requests. Right now, anyone who can reach the server on the network could call the project/task APIs directly without being logged in — this needs to be fixed before this goes further than a trusted-network demo
- **Plan selection (Team vs Solo)** — the choice screen exists, but there's no actual difference in behavior/limits behind it

## ❌ Planned in the Docs, Not Built Yet

The internal spec (`frontend/prd.md`) describes a much bigger product. These pieces aren't started:

- Task comments, @mentions, file attachments, or in-app chat
- Notifications (e.g. "you were assigned a task")
- An activity/audit log ("who changed what, when")
- A Settings screen (theme, language, changing your role)
- Real user roles/permissions (right now it's just "admin or not" — no per-project roles like editor/viewer)
- Data export (CSV/JSON/PDF)
- Database backups
- Multiple languages (i18n)
- Accessibility pass (screen-reader friendliness, etc.)
- Time tracking / logging hours
- Subscription plans & billing (Stripe/Paddle)
- Forgot-password flow
- Protection against repeated failed login attempts
- Automated tests and a CI pipeline (there currently are zero tests in the project)
- Handling what happens if two people edit the same thing while offline (conflict resolution)

## 💡 What I'd Recommend Adding to a v1/MVP (Not Currently Planned or Built)

Beyond what's in the existing spec, here's what I think would meaningfully improve a first real release, roughly in priority order:

1. **Lock down the API** — this isn't a "nice to have," it's the first thing to fix. Right now anyone on the network can hit the backend without logging in.
2. **Basic task detail view** — right now there's no way to open a task and see/edit everything about it in one place (description, due date, assignee, comments) — just inline edits on a card. Even a simple modal would make the app feel complete.
3. **Working search/filter** — since the UI already exists, finishing the wiring is low effort for a big usability win.
4. **A "what changed" feed** — even a lightweight version of the activity log (not a full audit trail) helps a team trust that the tool is tracking things properly.
5. **Basic notifications** — at minimum, a visual badge when you're assigned a task, even without email/push.
6. **Simple backup/export** — a "download my data" button (CSV or JSON) is cheap to build and gives users confidence their local-only data isn't at risk of being lost.
7. **A real Settings page** — even just theme (light/dark) and account info; users expect this in any modern app.
8. **Minimal automated tests** — not full 80% coverage, but at least tests around auth and task/project CRUD, since those are the core of the product and currently have zero safety net.

Things I'd explicitly *deprioritize* for v1 despite being in the original spec: billing/plans, multi-language support, chat, and full WCAG accessibility compliance — all reasonable long-term goals, but not necessary to prove the core product works.

---
*Based on a code-level audit of routes, pages, and components as of 2026-09-05. See [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for the general project explanation.*
