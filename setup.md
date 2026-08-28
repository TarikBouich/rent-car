# RentCar — Local Setup Guide

This guide walks you through setting up the **RentCar** project on your local machine, step by step.

It covers **Windows**, **macOS**, and **Linux**. Where a step differs per OS, you'll find a clearly marked block for each.

RentCar is a full-stack, multi-tenant car rental management SaaS:

- **Frontend** — Vue 3 + Pinia + Vite + Tailwind CSS (in the repo root)
- **Backend** — Node.js + Express + Sequelize (in `server/`)
- **Database** — MySQL

---

## 1. Prerequisites

Make sure these are installed on your machine:

| Tool | Version | Why |
|------|---------|-----|
| **Node.js + npm** | v18 or newer (v20 LTS recommended) | Both apps run on Node |
| **MySQL** | 5.7+ / 8.x (or MariaDB) | Stores all application data |
| **Git** | any recent version | To clone the repository |

### Install per OS

**Windows**
1. **Node.js** → download the `Windows Installer (.msi)` from <https://nodejs.org> and run it. This installs both `node` and `npm`.
2. **Git** → download **"Git for Windows"** from <https://git-scm.com>. During install, keep default options. This gives you Git **and** a `Git Bash` terminal (recommended for the commands below).
3. **MySQL** → download the **MySQL Installer** from <https://dev.mysql.com/downloads/installer/>. Choose **"Full"** or at least **"MySQL Server"**. During setup, you will be asked to set a **root password — remember it** (you'll need it in `server/.env` step 4.2).

   > **Alternative (simpler):** install **XAMPP** (<https://www.apachefriends.org>) and start **MySQL** from the XAMPP Control Panel. XAMPP's MySQL runs on port 3306 with `root` / **no password** by default.

**macOS**
```bash
brew install node mysql
brew services start mysql
```

**Linux (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install nodejs npm git
sudo apt install mysql-server
sudo systemctl start mysql
```

### Verify the install (all OS)

```bash
node -v
npm -v
git --version
```

> On Windows, open **Git Bash** or **PowerShell** to run these commands. If `node` is not recognized, restart your terminal (Node/MySQL add themselves to `PATH` during install).

---

## 2. Clone the repository

```bash
git clone <repository-url>
cd rent-car
```

> On Windows, a common location is `C:\Projects\rent-car`. On macOS/Linux, e.g. `~/dev/rent-car`.

---

## 3. Set up the database

### 3.1 Make sure MySQL is running

**Windows**
- **MySQL Server** (MySQL Installer): it runs as a **Windows service** (started automatically). To check: `Services` app (Win+R → `services.msc`) → look for **MySQL80** → Status *Running*.
- **XAMPP**: open the **XAMPP Control Panel** and click **Start** next to **MySQL** (the port must be `3306`).

**macOS / Linux**
```bash
mysqladmin status        # if this replies, MySQL is up
# or, to start it:
brew services start mysql        # macOS
sudo systemctl start mysql       # Linux
```

### 3.2 Create the database

Open the MySQL command-line client:

```bash
mysql -u root -p
```

- Windows / macOS / Linux — the command works the same everywhere.
- If prompted, enter the **root password** you set during MySQL installation (or empty if you used XAMPP / a passwordless setup).
- If `mysql` is not recognized on Windows, you can also run the same statement from **MySQL Workbench** (installed with MySQL Installer), or from XAMPP's **Admin** page → **SQL** tab.

Then run:

```sql
CREATE DATABASE IF NOT EXISTS rentcar_db;
EXIT;
```

---

## 4. Set up the backend (`server/`)

### 4.1 Install dependencies

```bash
cd server
npm install
```

> This creates `server/node_modules`. Run `npm install` again only if dependencies change.

### 4.2 Configure environment

The file `server/.env` may already exist with local defaults. If not, create it by copying the example:

**Windows (CMD / PowerShell / Git Bash):**

```bash
copy .env.example .env       # CMD
Copy-Item .env.example .env  # PowerShell
```

**macOS / Linux:**

```bash
cp .env.example .env
```

If `.env.example` doesn't exist, or you prefer editing directly, create `server/.env` with:

```env
PORT=3000
JWT_SECRET=suPerS3cr3tRentCarKey2026

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rentcar_db
DB_USER=root
DB_PASS=
```

The critical value for a Windows team member is **`DB_PASS`**:

- **MySQL Installer** (Windows): you were forced to set a root password → put it here. Example: `DB_PASS=MyStrongPass!`.
- **XAMPP** or passwordless local MySQL: leave `DB_PASS=` empty.
- **macOS/Linux homebrew/apt**: if you set a root password, put it here; otherwise leave empty.

Adjust `DB_USER` / `DB_HOST` if your MySQL uses a different account or host.

> **Security note:** the empty `DB_PASS` and default `JWT_SECRET` are fine for local development only. Never use defaults in production.

### 4.3 (Optional) Seed with demo accounts

The repo ships a seed script that creates a **superadmin**, a **tenant admin**, and a demo company:

```bash
node server/scripts/seed.js
```

> ⚠️ **Warning 1:** The seed script runs `sync({ force: true })`, which **drops and recreates all tables**.
> ⚠️ **Warning 2:** The car-seeding part of this script is **outdated** (it uses old field names) and may fail partway. The login accounts below are still created.

**Default demo accounts after seeding:**

| Role | Email | Password |
|------|-------|----------|
| Superadmin | `superadmin@test.com` | `admin` |
| Admin (tenant) | `admin@test.com` | `admin` |

> If you skip seeding, tables are still auto-created when the backend starts (see 4.4), and you manage agencies/users from inside the app.

### 4.4 Start the backend

```bash
node index.js
```

You should see logs indicating the database synced, then Express listening on **port 3000**.

> On Windows, **leave this terminal window open** (don't close it — that stops the server). To stop it later, press **Ctrl+C**.

Verify it's alive (open a second terminal):

```bash
curl http://localhost:3000/api/health
# => {"status":"ok","message":"API is running"}
```

> PowerShell note: `curl` in PowerShell is an alias for `Invoke-WebRequest`. If the output looks messy or `curl` complains, run:
> ```powershell
> (Invoke-WebRequest http://localhost:3000/api/health).Content
> ```

---

## 5. Set up the frontend (repo root)

### 5.1 Install dependencies

Open a **new terminal** and go back to the project root:

```bash
cd <path-to>/rent-car
npm install
```

> This creates `node_modules` in the project root. 🚨 You now have **two** separate `node_modules`: one in the root (frontend) and one in `server/` (backend). They are independent.

### 5.2 (Optional) Configure the API URL

The frontend **auto-detects the API in development** — it targets `http://<current-machine-name>:3000/api`, so it already points to the backend from section 4. No configuration is needed for a normal local run.

You only need a `.env` if you want to override this (e.g. a shared backend on the LAN):

```env
# root .env
VITE_API_URL=http://<server-ip>:3000/api
```

> The existing `.env` in the repo contains `VITE_API_BASE_URL=https://rent-car.com`, which is used for **production** builds only. In development (`npm run dev`) it is ignored in favor of auto-detection.

### 5.3 Start the frontend dev server

```bash
npm run dev
```

Vite will print a local URL (usually **http://localhost:5173**). Open it in your browser.

> If your browser auto-opens ***another*** URL that seems wrong (e.g. your computer's LAN IP), or if opening on a phone is desired, see section 7 (LAN access).

---

## 6. Log in

Open the frontend URL and log in with one of the seeded accounts (see 4.3), or with credentials created in your own database:

- **Superadmin** → the SaaS supervision panel at `/super-admin`
- **Admin** → `admin@test.com` / `admin` → main dashboard

---

## 7. (Optional) Access from your phone / another device on the LAN

1. Find your machine's LAN IP:
   - **Windows:** `ipconfig` → look for `IPv4 Address` under your active adapter (e.g. `192.168.1.42`).
   - **macOS:** `ipconfig getifaddr en0`
   - **Linux:** `hostname -I`
2. Make sure both servers are running (`node index.js` in `server/` and `npm run dev` at the root).
3. Create/update the **root `.env`** with your LAN IP:
   ```env
   VITE_API_URL=http://192.168.1.42:3000/api
   ```
   and restart `npm run dev`.
4. On the phone, open `http://192.168.1.42:5173`.

**Windows only — open the firewall:**
If the other device can't connect, allow Node.js through Windows Firewall:
1. Control Panel → **Windows Defender Firewall** → **Allow an app or feature through Windows Defender Firewall**.
2. Click **Change settings** → **Allow another app…** → browse to your Node.js (`C:\Program Files\nodejs\node.exe`).
3. Make sure both **Private** and **Public** are checked → OK.

---

## 8. Useful commands

| Task | Command |
|------|---------|
| Start the backend | `cd server && node index.js` |
| Reset DB + seed demo data | `node server/scripts/seed.js` ⚠️ drops all tables |
| Start the frontend dev server | `npm run dev` |
| Production build (root) | `npm run build` |
| Preview the production build | `npm run preview` |
| Check the API is up | `curl http://localhost:3000/api/health` |

---

## 9. Project structure at a glance

```
rent-car/
├── src/                    # Vue 3 frontend
│   ├── views/              # pages
│   ├── stores/             # Pinia stores (state + API calls)
│   ├── services/           # axios API clients + SSE stream
│   ├── router/             # routes + guards
│   ├── layouts/            # app shells (default, auth, print, landing)
│   └── utils/              # navigation guard, helpers
├── server/                 # Node.js backend
│   ├── config/             # Sequelize / DB connection
│   ├── controllers/        # route handlers
│   ├── middleware/         # JWT auth
│   ├── models/             # Sequelize models (auto-syncs tables)
│   ├── routes/             # express routers
│   └── scripts/            # seed & maintenance scripts
├── .env                    # frontend env (production API URL)
└── server/.env             # backend env (port, DB, JWT secret)
```

---

## 10. Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| `node` / `npm` / `mysql` is not recognized (Windows) | Tools not on `PATH`, or terminal not restarted | Restart the terminal / reboot. On Windows also check they were installed for "all users" |
| Port 3000/5173 already in use | Another instance running | Stop it, or change `PORT` in `server/.env` / Vite host |
| `ECONNREFUSED` connecting to MySQL | MySQL not running (Windows: service stopped / XAMPP not started) | Windows: start **MySQL80** via `services.msc` or **XAMPP Control Panel**; otherwise start MySQL and check credentials |
| `Access denied for user 'root'` (Windows) | Wrong / empty `DB_PASS` | Put your real MySQL Installer root password in `server/.env` → restart backend |
| `Unknown database 'rentcar_db'` | DB not created | Run the `CREATE DATABASE` from section 3.2 |
| `ER_NOT_SUPPORTED_AUTH_MODE` / PHPMyAdmin-style auth errors | Old client vs new MySQL auth plugin `caching_sha2_password` | Use MySQL `8.x` with the bundled `mysql2` driver (it supports it). If stuck, add to the MySQL config used by the app: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpass';` |
| Backend logs errors at startup (`alter` sync) | Schema drift between versions | Update the repo to latest; if blocked, `node server/scripts/seed.js` (⚠️ drops data) |
| Frontend can't reach the API | Wrong host in dev | In dev the API auto-targets `:3000`; make sure the backend is running. Override with `VITE_API_URL` in root `.env`, then restart `npm run dev` |
| Feature (SSE / chat) not updating in real time | SSE needs an open connection; some proxies block it | Verify the network allows long-lived connections (works locally out of the box) |
| Other device can't reach the app (Windows) | Windows Firewall blocks Node | See section 7 → "Windows only — open the firewall" |
| Login works but data is empty | No agencies/users created yet | Create agencies and users in the app, or run the seed script |
| `npm install` fails / network errors | Corporate proxy or slow mirror | Retry; or use a mirror (e.g. `npm install --registry=https://registry.npmmirror.com`). Not a code issue |

---

## 11. Quick start (TL;DR)

### Windows (Git Bash / PowerShell)

```bash
# 0. Install once: Node.js, Git for Windows, MySQL (remember the root password).
# 1. Backend
cd server
npm install
#   → get MySQL running, create DB `rentcar_db`, put your root password in server/.env
node index.js

# 2. Frontend (new terminal, at the repo root)
cd C:\Projects\rent-car
npm install
npm run dev
# → open http://localhost:5173
```

### macOS / Linux

```bash
# 1. Backend
cd server
npm install
#   → MySQL running, DB `rentcar_db` created, server/.env adjusted
node index.js

# 2. Frontend (new terminal, at the repo root)
npm install
npm run dev
# → open http://localhost:5173
```