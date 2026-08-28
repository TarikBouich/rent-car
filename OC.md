# RentCar - Deep Codebase Analysis

> Full-stack SaaS multi-tenant car rental management platform.
> Analysis date: July 2026

---

## 1. Project Overview

RentCar is a **multi-tenant car rental management platform** (SaaS model) that allows rental companies to manage their fleet, clients, contracts, maintenance, accounting, and inter-agency operations. It includes a **superadmin panel** for SaaS-level tenant supervision.

---

## 2. Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Vue 3 (Composition + Options API) | UI framework |
| Vite 5 | Build tool / dev server |
| Vue Router 4 | Client-side routing with auth guards |
| Pinia | State management (21 stores) |
| Axios | HTTP client with interceptors |
| Tailwind CSS 3 | Styling (utility-first, dark mode) |
| ApexCharts / vue3-apexcharts | Dashboard analytics charts |
| FullCalendar (vue3) | Vehicle event calendar |
| html2pdf.js / jsPDF | PDF generation (contracts, invoices) |
| tesseract.js | OCR capability |
| simple-keyboard | Arabic keyboard input support |
| written-number | Convert numbers to French words (invoices) |
| @iconoir/vue | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| Sequelize 6 | ORM (MySQL dialect) |
| MySQL2 | Database driver |
| jsonwebtoken (JWT) | Authentication (12h expiry) |
| bcryptjs | Password hashing (planned, not yet active) |
| cors + dotenv | Cross-origin + environment config |

### DevOps / Tooling
| Technology | Purpose |
|---|---|
| ESLint + Prettier | Code quality |
| PostCSS + Autoprefixer | CSS processing |
| SSE (Server-Sent Events) | Real-time state synchronization |

---

## 3. Directory Structure

```
rent-car/
├── src/                          # Frontend source
│   ├── App.vue                   # Root component, layout switcher, store init
│   ├── main.js                   # Entry point (Vue + Pinia + Router)
│   ├── style.css                 # Global styles
│   ├── assets/                   # CSS, images
│   ├── router/
│   │   ├── index.js              # 45+ route definitions
│   │   └── authGuard.js          # (navigationGuard.js)
│   ├── stores/                   # 21 Pinia stores
│   │   ├── userStore.js          # Auth, roles, multi-tenant filtering
│   │   ├── carStore.js           # Fleet management
│   │   ├── clientStore.js        # Client management
│   │   ├── contratStore.js       # Rental contracts (via state JSON)
│   │   ├── alertStore.js         # Cross-module alert engine
│   │   ├── chatStore.js          # Internal messaging
│   │   ├── chargeStore.js        # Charges/expenses
│   │   ├── assuranceStore.js     # Insurance management
│   │   ├── visiteStore.js        # Technical inspections
│   │   ├── entretienStore.js     # Maintenance logs
│   │   ├── settingsStore.js      # Threshold/config settings
│   │   ├── signatureStore.js     # Digital signature flow
│   │   ├── brandStore.js         # Car brands
│   │   ├── modelStore.js         # Car models
│   │   ├── agencyStore.js        # Agency management
│   │   ├── companyStore.js       # Tenant/company management
│   │   ├── transactionStore.js   # Financial transactions
│   │   ├── factureStore.js       # Invoices (via API)
│   │   ├── assuranceAgencyStore.js
│   │   ├── centreVisiteStore.js
│   │   └── entretienTypeStore.js
│   ├── services/                 # API layer
│   │   ├── api.js                # Axios instance, JWT interceptor
│   │   ├── authService.js        # Login, getMe
│   │   ├── carService.js         # Car CRUD
│   │   ├── clientService.js      # Client CRUD
│   │   ├── userService.js        # User CRUD
│   │   ├── agencyService.js      # Agency CRUD
│   │   ├── companyService.js     # Company CRUD
│   │   ├── brandService.js       # Brand CRUD
│   │   ├── modelService.js       # Model CRUD
│   │   ├── stateService.js       # AppState key-value API
│   │   ├── stateJsonService.js   # JSON wrapper for AppState
│   │   └── stateStreamService.js # SSE subscription
│   ├── views/                    # 47 active + 4 unused views
│   ├── components/               # 12 reusable components
│   ├── layouts/                  # 3 layouts (Auth, Default, Print)
│   ├── utils/                    # Helpers (ID gen, navigation guard, plans)
│   ├── directives/               # Custom Vue directives
│   └── store/                    # Legacy reactive store (localStorage)
│       ├── index.js
│       └── imageStore.js
├── server/                       # Backend source
│   ├── index.js                  # Express entry point
│   ├── .env                      # Server environment vars
│   ├── config/
│   │   └── database.js           # Sequelize MySQL config
│   ├── models/                   # 10 Sequelize models
│   │   ├── index.js              # Model registry + associations
│   │   ├── Company.js            # Tenant (SaaS)
│   │   ├── User.js               # Users with roles
│   │   ├── Car.js                # Vehicle (75+ fields)
│   │   ├── Client.js             # Customer
│   │   ├── Agency.js             # Branch office
│   │   ├── Contrat.js            # Rental contract
│   │   ├── Brand.js              # Car brand
│   │   ├── CarModel.js           # Car model
│   │   ├── AppState.js           # Key-value state blob
│   │   └── Facture.js            # Invoice
│   ├── controllers/              # 10 controllers
│   ├── routes/                   # 10 route files
│   ├── middleware/
│   │   └── auth.js               # JWT auth + role middleware
│   ├── services/
│   │   └── stateEventHub.js      # SSE broadcast hub
│   ├── scripts/
│   │   ├── seed.js               # DB seeder
│   │   └── cleanGhostCars.js     # Cleanup script
│   └── package.json              # Backend dependencies
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite config + signature relay plugin
├── tailwind.config.js            # Tailwind theme + dark mode
├── postcss.config.js
├── .env                          # VITE_API_BASE_URL
├── project.md                    # Existing project summary
├── TODO.md                       # Development TODO list
└── *.py                          # One-off Python maintenance scripts
```

---

## 4. Architecture

### High-Level Flow
```
Browser (Vue 3 SPA)
    │
    ├── Vue Router (client-side routing + auth guards)
    ├── Pinia Stores (state management)
    │       ├── API Stores (car, client, user, agency, etc.) → REST API
    │       └── State Stores (contrats, reservations, chat, etc.) → AppState API
    ├── SSE Stream → Real-time updates
    └── Vite Dev Server (signature relay plugin)
            │
            ▼
    Express REST API (port 3000)
        ├── JWT Auth Middleware
        ├── Controllers → Sequelize ORM
        └── MySQL Database
```

### Multi-Tenancy Strategy
- Every entity has a `companyId` foreign key
- All API queries filter by `req.user.companyId`
- Frontend `userStore.filterByAgency()` applies client-side filtering
- Superadmin sees all companies; Admin sees own company; Agent sees own agency

### Data Strategy (Hybrid - In Migration)
- **DB-backed entities**: Cars, Users, Clients, Agencies, Brands, Models, Factures
- **State JSON blobs** (AppState table): Reservations, Contracts, Charges, Assurances, Visites, Entretiens, Chat, Settings
- Migration from localStorage → AppState → full DB is in progress

---

## 5. Database Schema

### Tables & Key Fields

#### Company
```
id (PK), name, email, phone, planId, status
```

#### User
```
id (PK), name, firstName, lastName, cne, email (unique), password,
role (superadmin|admin|gerant|employe|agent), telephone,
isActive, status, agencyId, companyId (FK), permissions (JSON)
```

#### Car
```
id (PK), name, licensePlate, chassisNumber, matriculeWWW,
brandId, modelId, year, circulationDate, seats, color,
fuelType, transmission, category, observation,
pricePerDay, agencyId, status,
image (base64), images (JSON), damages (JSON),
currentMileage, oilMileage, averageMileagePerDay,
needsVidange, lastVidangeKm, nextVidangeKm,
visiteTechniqueEndDate, assuranceEndDate, autorisationEndDate,
equipments (JSON), options (JSON),
buyerName, salePrice, saleDate, ...
isCreditPurchase, initialAdvance, monthlyTraite, ...
companyId (FK)
```

#### Client
```
id (PK), civility, clientType, firstName, lastName, firstNameAR, lastNameAR,
birthDate, birthPlace, nationality, residenceCity,
companyName, companyCity, companyContact, ice, if, companyAddress,
nationalId, cnieIssueDate, cnieExpiryDate,
phoneNumber, phoneNumber2, email, address, notes,
driverLicenseFront/Back (base64 LONG), idCardFront/Back, passportFront/Back,
agencyId, companyId (FK), archived, status
```

#### Agency
```
id (PK), name, ville, location, address, phone, email,
if, rc, patente, ice, gerantId,
documents (JSON), initialEspece, initialBanque, status
```

#### Contrat
```
id (PK), numero, clientId, carId, agencyId,
dateContrat, lieuContrat, dateSortie, dateRetour, duree,
lieuLivraison, lieuRecuperation,
kmDepart, carburantDepart,
prixParJour, total, avance, reste, typePaiement,
etat, departDamages (JSON), retourDamages (JSON),
hasConducteur2, conducteur2 (JSON),
clientSignature (LONGTEXT), paidAmount, companyId (FK)
```

#### Facture
```
id (PK), companyId (FK), numero, contratId, clientId, carId, agencyId,
issueDate, issueLocation, lines (JSON), tvaRate, totals (JSON),
totalInWords, clientSnapshot (JSON), carSnapshot (JSON), agencySnapshot (JSON)
```

#### AppState
```
id (PK auto), companyId (FK), key, value (LONGTEXT)
UNIQUE(companyId, key)
```

#### Brand / CarModel
```
Brand: id (PK), name, logo (base64)
CarModel: id (PK), name, category, brandId (FK)
```

### Associations
```
Company ──1:N── User, Car, Client, Agency, Contrat, AppState, Facture
Brand ──1:N── CarModel
```

---

## 6. API Endpoints

| Route | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/auth/login` | POST | No | Login, returns JWT |
| `/api/auth/me` | GET | Yes | Current user profile |
| `/api/cars` | GET/POST | Yes | List/Create cars |
| `/api/cars/:id` | GET/PUT/DELETE | Yes | Single car CRUD |
| `/api/brands` | GET/POST | Yes | Brands CRUD |
| `/api/models` | GET/POST | Yes | Car models CRUD |
| `/api/agencies` | GET/POST | Yes | Agencies CRUD |
| `/api/agencies/:id` | GET/PUT/DELETE | Yes | Single agency CRUD |
| `/api/users` | GET/POST | Yes | Users CRUD |
| `/api/users/:id` | GET/PUT/DELETE | Yes | Single user CRUD |
| `/api/companies` | GET/POST | Yes | Companies CRUD |
| `/api/clients` | GET/POST | Yes | Clients CRUD |
| `/api/clients/:id` | GET/PUT/DELETE | Yes | Single client CRUD |
| `/api/state` | GET | Yes | Get all state keys (or filtered) |
| `/api/state/:key` | GET/PUT/DELETE | Yes | Key-value CRUD |
| `/api/state/stream` | GET (SSE) | Yes | Real-time state updates |
| `/api/factures` | GET/POST | Yes | Invoices CRUD |
| `/api/factures/:id` | GET/PUT/DELETE | Yes | Single invoice CRUD |
| `/api/health` | GET | No | Health check |

---

## 7. Frontend Routes

| Path | Component | Auth | Role |
|---|---|---|---|
| `/login` | LoginView | No | - |
| `/sign/:token` | SignatureCaptureView | No | - |
| `/` | Redirect | - | → /dashboard (admin) or /cars |
| `/dashboard` | NewDashboardView | Yes | Admin |
| `/cars` | NewCarsView | Yes | All |
| `/cars/add` | NewAddCarView | Yes | All |
| `/cars/availability` | CarAvailabilityView | Yes | All |
| `/cars/damages` | CarDamagesView | Yes | All |
| `/cars/:id` | CarProfileView | Yes | All |
| `/marques` | BrandsView | Yes | All |
| `/modeles` | ModelsView | Yes | All |
| `/car-events` | CarEventsView | Yes | All |
| `/reservations` | ReservationsView | Yes | All |
| `/reservations/add` | NewReservationView | Yes | All |
| `/clients` | ClientsView | Yes | All |
| `/clients/add` | AddClientView | Yes | All |
| `/active-rentals` | ActiveRentalsView | Yes | All |
| `/archived-reservations` | ArchivedReservationsView | Yes | All |
| `/agents` | AgentsView | Yes | Admin |
| `/agents/add` | AddAgentView | Yes | Admin |
| `/agents/:id` | AgentProfileView | Yes | Admin |
| `/alerts` | AlertsView | Yes | All |
| `/agencies` | AgenciesView | Yes | Admin |
| `/agencies/:id` | AgencyProfileView | Yes | Admin |
| `/accounting` | AccountingView | Yes | All |
| `/settings` | SettingsView | Yes | Admin |
| `/supervision` | SupervisionView | Yes | Admin |
| `/visites-techniques` | VisitesTechniquesView | Yes | All |
| `/centres-visite` | CentresVisiteView | Yes | All |
| `/assurances` | AssurancesView | Yes | All |
| `/assurance-agences` | AssuranceAgencesView | Yes | All |
| `/assistances` | AssistancesView | Yes | All |
| `/entretiens` | EntretiensView | Yes | All |
| `/taches` | TachesView | Yes | All |
| `/contrats` | ContratsView | Yes | All |
| `/contrats/add` | NewAddContratView | Yes | All |
| `/contrats/:id/print` | ContratPrintView | Yes | Print layout |
| `/factures` | FacturesView | Yes | All |
| `/accidents` | AccidentsView | Yes | All |
| `/versements` | VersementsView | Yes | All |
| `/financements` | FinancementsView | Yes | All |
| `/traites` | TraitesView | Yes | All |
| `/statistiques` | StatistiquesView | Yes | All |
| `/rapports` | RapportsView | Yes | All |
| `/super-admin` | SuperAdminDashboard | Yes | SuperAdmin |
| `/super-admin/client/:id` | TenantProfileView | Yes | SuperAdmin |
| `/super-admin/settings` | SuperAdminSettingsView | Yes | SuperAdmin |

---

## 8. Authentication & Authorization

### Flow
1. User submits email/password → `POST /api/auth/login`
2. Server validates credentials (raw comparison, bcrypt planned)
3. JWT issued with `{ id, email, role, companyId }` payload, 12h expiry
4. Token stored in `localStorage`
5. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
6. On 401 from `/auth/me`, auto-logout

### Roles
| Role | Access Level |
|---|---|
| `superadmin` | SaaS supervision only (`/super-admin/*`) |
| `admin` | Full company access + admin routes |
| `gerant` | Agency-scoped operations |
| `employe` | Agency-scoped operations |
| `agent` | Agency-scoped operations |

### Frontend Guard Logic (`navigationGuard.js`)
- Superadmin locked to `/super-admin/*`
- Non-superadmin blocked from `/super-admin/*`
- Admin-only routes: dashboard, agents, agencies, settings, supervision
- Non-admin users with explicit `permissions` object can access specific modules
- Agency-restricted users redirected to their own agency profile

---

## 9. Key Features

### Fleet Management
- Full car CRUD with 75+ fields (specs, images, maintenance, sale info, credit)
- Car profile view with damage map
- Availability checker by date range
- Brand/Model management with logos
- Car events calendar (FullCalendar)

### Client Management
- Individual + corporate clients
- Bilingual support (French + Arabic name fields)
- Document uploads (driver license, ID card, passport - base64)
- Archiving system

### Contracts & Reservations
- Contract creation with pickup/return details
- Departure/return damage tracking
- Secondary driver support
- Digital client signature (cross-device flow via Vite relay plugin)
- PDF contract printing
- Active rental tracking

### Maintenance & Compliance
- Technical inspection (visite technique) tracking
- Insurance management
- Maintenance logs (entretiens) with KM + date alerting
- Custom maintenance types
- Oil change (vidange) tracking with KM thresholds

### Accounting
- Charges/expenses tracking
- Invoices (factures) with TVA, line items, total in words
- Versements (payments)
- Financements
- Traites (installment payments)

### Alerts Engine
- Automatic cross-module alert generation
- Configurable thresholds (days before expiry, KM before maintenance)
- Categories: voitures (cars), locations (rentals)
- Priority levels: high, medium, low
- Per-agency filtering

### Internal Chat
- 1-to-1 conversations between employees
- File attachments (base64)
- Unread message counts
- Real-time sync via SSE

### Digital Signature
- Cross-device signature capture (admin creates, client signs)
- PIN verification flow
- Vite dev server signature relay plugin
- Production signature via same API

### SuperAdmin SaaS Panel
- Multi-tenant company management
- Subscription plan management (Demo, Starter, Pro, Entreprise)
- Tenant suspension
- SaaS-level analytics

---

## 10. SaaS Plans

| Plan | Price | Cars | Users | Agencies | Storage |
|---|---|---|---|---|---|
| Demo | Free | 5 | 1 | 1 | 0 GB |
| Starter | 149 MAD/mo | 7 | 4 | 1 | 2 GB |
| Pro | 249 MAD/mo | 20 | 12 | 2 | 10 GB |
| Entreprise | 399 MAD/mo | 100 | 20 | 7 | 50 GB |

---

## 11. Real-Time (SSE)

- Backend: `stateEventHub.js` maintains per-company client sets
- Endpoint: `GET /api/state/stream` (SSE)
- Events broadcast on every `AppState` upsert/delete
- Frontend: `stateStreamService.js` subscribes via `EventSource`
- Used primarily by `chatStore` for live message sync
- 25s heartbeat interval

---

## 12. Vite Signature Relay Plugin

Custom Vite middleware (`vite.config.js`) that enables cross-device signature capture during development:
- `POST /api/signature` with actions: CREATE, VERIFY, UPDATE, DELETE
- In-memory store (not persistent)
- CORS enabled for LAN access
- PIN-based verification

---

## 13. Environment Variables

### Frontend (`.env`)
```
VITE_API_BASE_URL=https://rent-car.com
```

### Backend (`server/.env`)
```
PORT=3000
JWT_SECRET=suPerS3cr3tRentCarKey2026
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rentcar_db
DB_USER=root
DB_PASS=
```

---

## 14. NPM Scripts

### Frontend
```json
"dev": "vite"           # Start dev server
"build": "vite build"   # Production build
"preview": "vite preview" # Preview production build
```

### Backend
```json
"test": "echo \"Error: no test specified\" && exit 1"
# No start script defined - run manually: node server/index.js
```

---

## 15. File Statistics

| Category | Count |
|---|---|
| Vue views | 47 active (+ 4 unused) |
| Pinia stores | 21 |
| Vue components | 12 |
| Backend controllers | 10 |
| Backend routes | 10 |
| Sequelize models | 10 |
| Frontend services | 12 |
| Layouts | 3 (Auth, Default, Print) |
| Python maintenance scripts | 10 |
| Total JS files | ~86 |
| Total Vue files | ~65 |

---

## 16. Code Patterns & Conventions

- **Pinia actions** handle all business logic and API calls
- **Filtering** always goes through `userStore.filterByAgency()` for tenant/agency isolation
- **IDs** are generated via `Date.now()` pattern (e.g., `car_${Date.now()}`)
- **Images** stored as base64 strings in MySQL TEXT/LONGTEXT fields
- **JSON fields** in MySQL for flexible data (equipments, damages, snapshots)
- **Dark mode** via Tailwind `class` strategy + `localStorage('mode')`
- **French language** used throughout UI and API messages
- **Bilingual support** for client names (French + Arabic)

---

## 17. Security Notes

- JWT secret is hardcoded in `.env` (should be rotated)
- Password comparison is raw string (bcrypt not yet active)
- Base64 images stored directly in DB (no file upload service)
- No rate limiting on API endpoints
- CORS is fully open (`*`) in development
- No input sanitization/XSS protection middleware visible
- Client documents (CNI, permis, passport) stored as base64 in DB

---

## 18. Migration Status (localStorage → MySQL)

| Module | Status |
|---|---|
| Cars | ✅ Fully migrated (API) |
| Users | ✅ Fully migrated (API) |
| Clients | ✅ Fully migrated (API) |
| Agencies | ✅ Fully migrated (API) |
| Brands | ✅ Fully migrated (API) |
| Models | ✅ Fully migrated (API) |
| Companies | ✅ Fully migrated (API) |
| Factures | ✅ Fully migrated (API) |
| Reservations | ❌ Still on AppState JSON |
| Contracts | ❌ Still on AppState JSON |
| Charges | ❌ Still on AppState JSON |
| Assurances | ❌ Still on AppState JSON |
| Visites | ❌ Still on AppState JSON |
| Entretiens | ❌ Still on AppState JSON |
| Chat | ❌ Still on AppState JSON |
| Settings | ❌ Still on AppState JSON |

---

## 19. Known TODOs (from TODO.md)

- Traites: Ensure data reflects car state, handle in alerts
- Dashboard analytics: Admin sees agency comparison, Gérant sees car type rental stats
- Pending features: taches, contrats, accidents, versements, financements, statistiques, rapports
- Inter-employee chat option

---

## 20. Entry Points

| File | Purpose |
|---|---|
| `index.html` | SPA shell |
| `src/main.js` | Vue app bootstrap |
| `src/App.vue` | Root component, layout selection, store init |
| `server/index.js` | Express server, DB sync, route mounting |
| `server/scripts/seed.js` | Database seeder (drops + recreates) |
