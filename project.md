# RentCar Project Summary

## 1. Project Identity
- **Project type**: Full-stack web application (SaaS-style multi-tenant rent-car management platform).
- **Repository root**: `rent-car`
- **Main functional scope**:
  - Agencies and users (admin, gérant/employé/agent, superadmin)
  - Cars, brands, models
  - Clients
  - Contracts / reservations / active rentals
  - Assurance, visites techniques, entretiens
  - Accounting/charges and dashboard alerts
  - Internal chat + signature flow

## 2. Languages Used
- **JavaScript** (frontend + backend core language)
- **Vue SFC templates** (`.vue` files)
- **CSS / Tailwind utility classes**
- **SQL via Sequelize ORM (MySQL dialect)**
- **Small amount of Python scripts** (repo maintenance/one-off fixes)

## 3. Core Technologies

### Frontend
- **Vue 3** (`vue`)
- **Vite 5** build/dev tooling
- **Vue Router 4** for routing and access-guarded navigation
- **Pinia** for state management (`src/stores`)
- **Axios** for API calls
- **Tailwind CSS** (+ PostCSS, Autoprefixer) for styling
- **ApexCharts + vue3-apexcharts** for analytics charts
- **FullCalendar** for vehicle event calendar
- **html2pdf.js / jsPDF / html2canvas** for PDF generation/print workflows
- **simple-keyboard** for Arabic keyboard support
- **tesseract.js** present for OCR-related capability

### Backend
- **Node.js + Express 5**
- **Sequelize 6** ORM
- **MySQL2** driver
- **JWT auth** (`jsonwebtoken`)
- **bcryptjs** for password hashing
- **CORS + dotenv**

### Realtime / Near-realtime
- **SSE (Server-Sent Events)** for state change stream (`/api/state/stream`)
- Frontend listener in `src/services/stateStreamService.js`

## 4. High-Level Architecture

### Frontend Structure (`src`)
- `views/` (46 Vue pages): business screens (cars, clients, contracts, settings, etc.)
- `stores/` (20 Pinia stores): domain state and business actions
- `components/` (11 main Vue components): sidebar, topbar, chat drawer, damage map, etc.
- `router/`: route definitions + navigation guard
- `layouts/`: `AuthLayout`, `NewDefaultLayout`, `PrintLayout`
- `services/`: API/state service adapters
- `utils/`: IDs, route access logic, defaults/constants

### Backend Structure (`server`)
- `controllers/` (9): request handlers by domain
- `routes/` (9): REST routes
- `models/` (10): Sequelize models and associations
- `middleware/auth.js`: token auth gate
- `config/database.js`: MySQL Sequelize config
- `services/stateEventHub.js`: SSE broadcast hub

## 5. Data Strategy (Important)
- The project is in a **migration model**:
  - Core entities use DB APIs (cars, users, clients, agencies, brands, models, etc.).
  - Some modules still use **state JSON keys** in `AppState` (`/api/state/:key`) as shared persisted blobs:
    - examples: `reservations`, `contrats`, `charges`, `assurances`, `visites`, `entretiens`, settings blobs.
- This is why you see both:
  - direct entity endpoints (`/api/cars`, `/api/clients`, …)
  - state endpoints (`/api/state/...`)

## 6. Authentication, Authorization, Roles
- JWT-based auth (`/api/auth`)
- Multi-tenant scoping by `companyId`
- Role model includes at least:
  - `superadmin`
  - tenant `admin`
  - operational roles (`gerant/gérant`, `employé`, `agent`)
- Frontend access filtering is enforced in:
  - route guard: `src/utils/navigationGuard.js`
  - data filter helper: `userStore.filterByAgency(...)`

## 7. Routing & UI Shell
- Main router file: `src/router/index.js`
- Layout selected per route meta:
  - `auth`
  - `new-default`
  - `print`
- Main app bootstrap:
  - `src/main.js`
  - `src/App.vue` (global store initialization + stale localStorage cleanup)

## 8. Key Modules (Frontend Domain Stores)
- `carStore`, `clientStore`, `agencyStore`, `userStore`
- `contratStore`, `chargeStore`, `transactionStore`
- `assuranceStore`, `visiteStore`, `entretienStore`, `entretienTypeStore`
- `brandStore`, `modelStore`
- `alertStore` (cross-module generated alerts)
- `chatStore` (internal messaging)
- `settingsStore` (thresholds/contract conditions)
- `companyStore` (SaaS/superadmin side)

## 9. Build / Run Tooling

### Frontend
- Scripts from root `package.json`:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`

### Backend
- Backend package in `server/package.json`
- Entry point: `server/index.js`
- DB sync on startup: `sequelize.sync({ alter: true })`

## 10. Notable Implementation Characteristics
- Strong use of Pinia action-driven business logic.
- Many screens are admin/operator operational dashboards.
- Styling is primarily Tailwind utility classes with dark-mode support.
- Internal chat and signature flows are integrated in default layout.
- Alerts are computed from car/maintenance/reservation data and filtered by tenant + agency.
- Vite dev config includes a custom **signature relay plugin** for cross-device signing flow.

## 11. File/Codebase Metrics (Current Snapshot)
- Approx tracked files (excluding `node_modules`, `dist`): **187**
- Extension distribution (top):
  - `.js`: 86
  - `.vue`: 65
  - `.py`: 10
  - `.json`: 6
- UI/business module counts:
  - Views: **46**
  - Stores: **20**
  - Components: **11**
  - Server controllers: **9**
  - Server routes: **9**
  - Server models: **10**

## 12. Current Overall Technical Direction
- Active transition from legacy/local persistence patterns to consistent DB-backed behavior.
- Multi-tenant + role-aware filtering is central and affects nearly every module.
- System already supports both tenant-ops and superadmin SaaS supervision workflows.
