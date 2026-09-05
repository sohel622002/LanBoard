# Project Vault — What Is This, Really?

## The Elevator Pitch

Project Vault is a desktop app for teams to manage projects together — think Trello/Jira-style Kanban boards — but with a twist: **all your project data stays on one person's computer**, not on someone else's cloud server.

One team member (the "admin" or "host") runs the app on their machine. That machine becomes the home for all the projects, tasks, and boards. Everyone else on the same office/home network (LAN) connects to that host machine's app and works together in real time — moving cards, updating tasks, seeing changes instantly.

Only the *login/account* part uses the cloud (via a service called Supabase), so people can securely sign in. But the actual work data (projects, boards, tasks) never leaves the host's computer.

## Why Would Someone Want This?

- **Privacy/control**: Your project data isn't sitting on a third-party company's servers.
- **No subscription needed for storage**: You're not paying a SaaS company to host your data.
- **Still feels "cloud-like"**: Real-time updates, multiple people working at once — just powered by a computer in the room instead of a data center.

## How It's Built (Plain English)

- **It's a desktop app**, built with a technology called Electron — this is the same approach apps like Slack or VS Code use, letting a web-style app run as a normal installable Windows program.
- **The visible part (frontend)** — the boards, buttons, pages you click on — is built with React, a popular toolkit for building interactive interfaces.
- **The backend (the "engine room")** — is a Node.js server that handles logic like creating projects, saving tasks, and pushing live updates to everyone connected.
- **The database** — where all the actual project/task data is stored — is PostgreSQL, running locally on the host's machine.
- **Real-time sync** — when one person moves a task, everyone else sees it instantly. This works through a technology called Socket.IO, which keeps a live connection open between the host and each teammate.
- **Finding each other on the network** — teammates' computers automatically discover the host computer on the same Wi-Fi/network (using a technique called Bonjour/mDNS), similar to how a printer on your network gets found automatically. If auto-discovery doesn't work, people can also type in the host's IP address manually.

## Folder Structure (What Lives Where)

| Folder | What's In It |
|---|---|
| `/` (root) | The Electron "shell" that wraps everything into a desktop app you can install |
| `/backend` | The server: handles logins, saves data, talks to the database, pushes live updates |
| `/frontend` | Everything you see and click: the boards, pages, buttons, forms |

Inside `/backend`, there's a split between:
- **cloud auth** — signing in/up via the internet (Supabase)
- **local auth** — logic that runs only on the host's local network

Inside `/frontend`, code is organized by purpose: reusable UI pieces (`components`), full screens (`pages`), API calls (`api`), and shared logic (`hooks`, `providers`).

## How Someone Would Run It (Simplified)

1. Install dependencies (a one-time setup step) in the root folder, the backend folder, and the frontend folder.
2. Fill in some settings (like a secret key and database connection info) in a configuration file.
3. Start the backend (the engine), start the frontend (the interface), and start the Electron shell (the app window) — or just run one "start" command that does it for development.
4. To hand it to teammates as a real installable app, there's a "build" step that packages everything into a Windows installer.

The app also has a **guided first-time setup** that automatically downloads and configures the local database, so a non-technical admin doesn't have to manually install PostgreSQL themselves.

## Key Features at a Glance

- Kanban-style project boards with stages and tasks
- Real-time collaboration — see teammates' changes as they happen
- Local-first data storage (your data stays on your network)
- Cloud-based secure login (so accounts are still verified properly)
- Automatic discovery of the host computer on the local network
- Packaged as a normal Windows desktop app (installable `.exe`)

---
*Generated as a plain-English overview — for technical details, see the project's `README.md` and `frontend/prd.md`.*
