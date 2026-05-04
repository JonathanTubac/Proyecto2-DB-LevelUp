# LevelUp — Gaming Store Management System

A full-stack web application for managing a gaming store. It covers product catalog, inventory, user management, purchases, digital wallets, and an admin dashboard with real-time KPI metrics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express.js v5 |
| Frontend | React v19 + Vite |
| Database | PostgreSQL 16 |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Security | Helmet, CORS, Rate Limiting |
| Logging | Winston |
| API Docs | Swagger / OpenAPI |
| Container | Docker + Docker Compose |
| Web Server | Nginx (Alpine) |

---

## Features

**Admin role**
- Dashboard with KPI metrics (total users, products, monthly sales, top product, active wallets, etc.)
- Full CRUD for products, categories, providers, and users
- Inventory management via supplier supply records
- View and filter all purchases
- Manage customer digital wallets

**Client role**
- Browse the store and add products to a shopping cart
- Purchase with digital wallet balance
- View purchase history
- Generate a purchase report as a PDF
- Profile management

---

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose (for the Docker setup)
- [Node.js](https://nodejs.org/) v20+ and [PostgreSQL](https://www.postgresql.org/) 16 (for the local setup)

---

## Project Structure

```
LevelUp/
├── backend/              # Express.js REST API
│   ├── src/
│   │   ├── config/       # DB and Swagger config
│   │   ├── controllers/
│   │   ├── repositories/ # Raw SQL queries
│   │   ├── services/     # Business logic
│   │   ├── routes/
│   │   ├── middlewares/  # Auth, logging, validation, error handling
│   │   ├── schemas/      # Zod schemas
│   │   ├── utils/
│   │   └── db/           # Database Dockerfile + SQL scripts
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── pages/        # Admin and client pages
│   │   ├── components/
│   │   ├── context/      # AuthContext, CartContext
│   │   ├── api/          # API client functions per resource
│   │   └── hooks/
│   ├── nginx.conf
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml    # Orchestrates DB + API + Frontend
├── .env.example          # Root env template for Docker
└── README.md
```

---

## Option 1 — Docker (recommended)

This is the simplest way to run the entire stack (database, API, and frontend) with a single command.

### 1. Create the root `.env` file

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

`.env` content:

```env
PORT=3000
NODE_ENV=production

# Database — used by the postgres container
DB_HOST=postgres
DB_PORT=5432
DB_NAME=levelup
DB_USER=proy2
DB_PASSWORD=your_db_password

# JWT — use long, random strings in production
JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Passed as build arg to the frontend container
VITE_API_URL=http://localhost:3000/api/v1
```

> **Important:** `DB_HOST` must stay as `postgres` (the Docker service name). Do not change it.

### 2. Build and start

```bash
docker compose up --build
```

On the first run Docker will:
1. Build the custom database image (PostgreSQL 16 + DDL + seed data)
2. Build the backend image
3. Build the frontend image (Nginx serving the React build)
4. Wait for the database health check before starting the API

### 3. Access the app

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000/api/v1 |
| Swagger docs | http://localhost:3000/api-docs |
| PostgreSQL | localhost:5432 |

### Stop the stack

```bash
docker compose down
```

To also remove the database volume (all data):

```bash
docker compose down -v
```

---

## Option 2 — Local Development

Run each service manually. You need PostgreSQL 16 already installed and running.

### 1. Create the database and run the SQL scripts

Connect to PostgreSQL and create the database:

```sql
CREATE DATABASE levelup;
```

Then run the initialization scripts in order:

```bash
psql -U your_user -d levelup -f backend/src/db/init/DDL.sql
psql -U your_user -d levelup -f backend/src/db/init/insercion.sql
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=levelup
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.

### 3. Configure the frontend

Open a new terminal:

```bash
cd frontend
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Install dependencies and start Vite:

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Test Credentials

The seed script (`insercion.sql`) creates the following users. Password for all of them:

```
Password!1
```

| Role | Email | Password |
|---|---|---|
| Admin | admin@levelup.com | Password!1 |
| Employee | carlos@levelup.com | Password!1 |
| Employee | maria@levelup.com | Password!1 |
| Client | juan@gmail.com | Password!1 |
| Client | ana@gmail.com | Password!1 |
| Client | pedro@gmail.com | Password!1 |

Wallets are created automatically for every user via a database trigger (`tgr_create_wallet_user`).

---

## API Reference

Interactive Swagger documentation is available at `http://localhost:3000/api-docs` once the API is running.

| Resource | Base path |
|---|---|
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Products | `/api/v1/products` |
| Categories | `/api/v1/categories` |
| Providers | `/api/v1/providers` |
| Supply records | `/api/v1/provide` |
| Purchases | `/api/v1/purchases` |
| Wallets | `/api/v1/wallets` |
| Dashboard | `/api/v1/dashboard` |
| Health | `/api/v1/health` |

---

## Database Schema (key tables)

| Table | Description |
|---|---|
| `roles` | Administrador / Empleado / Cliente |
| `usuarios` | Registered users with role |
| `empleados` | Employee profile (carnet, salary) |
| `productos` | Products with stock, price, category |
| `categorias` | Product categories |
| `proveedores` | Suppliers |
| `brinda` | Supplier → Product supply records (updates stock via trigger) |
| `compras` | Purchase orders |
| `detalle_compras` | Line items per purchase |
| `billeteras` | Digital wallet per user (auto-created on register) |
| `movimientos` | Wallet transaction log |
| `refresh_tokens` | JWT refresh token store |

A `dashboard_metrics` view aggregates KPIs for the admin dashboard.

---

## Logs

Application logs are written by Winston and mounted at `./logs/` from the host machine (Docker) or the `backend/logs/` directory (local).
