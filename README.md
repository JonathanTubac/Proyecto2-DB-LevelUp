# LevelUp — Gaming Store Management System

A full-stack web application for managing a gaming store. It covers product catalog, inventory, user management, purchases, digital wallets, and an admin dashboard with real-time KPI metrics.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://proyecto2-db-level-up-front.vercel.app |
| Backend API | https://proyecto2-db-level-up-backend.vercel.app/health |
| Swagger Docs | https://proyecto2-db-level-up-backend.vercel.app/api-docs |

---

## Rubric Checklist

> Each criterion is graded as passed or not passed — no partial credit. All criteria are mandatory. Maximum score: **100 points**.

### I. Security & Roles — 55 pts

| Criterion | Status | Pts |
|---|---|---|
| 5 roles defined in the DBMS with `CREATE ROLE` and granular permissions via `GRANT`/`REVOKE` | ✅ | 20 |
| Role schema documented: name, accessible tables, permitted operations | ✅ | 10 |
| Login/logout authentication with one working test user per role in the seed script | ✅ | 10 |
| Routes and UI views protected according to the authenticated user's role | ✅ | 15 |

### II. Stored Procedures & ORM — 45 pts

| Criterion | Status | Pts |
|---|---|---|
| At least 5 stored procedures invoked from the backend (not standalone scripts) | ✅ | 15 |
| At least 1 stored procedure with IN/OUT parameters and exception handling | ✅ | 10 |
| At least 1 explicit transaction with ROLLBACK inside a stored procedure | ✅ | 10 |
| ORM configured and used in at least 3 CRUD operations | ✅ | 10 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express.js v5 |
| Frontend | React v19 + Vite |
| Database | PostgreSQL 16 |
| ORM | Prisma v5 |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Security | Helmet, CORS, Rate Limiting |
| Logging | Winston |
| API Docs | Swagger / OpenAPI |
| Container | Docker + Docker Compose |
| Web Server | Nginx (Alpine) |

---

## I. Security & Roles

### DBMS Roles

Five roles are defined at the PostgreSQL level using `CREATE ROLE` with granular permissions assigned via `GRANT` and `REVOKE`. Defined in `backend/src/db/init/DDL.sql`, created automatically when the database container initializes.

| DBMS Role | App Role | Accessible Tables | Permitted Operations |
|---|---|---|---|
| `rol_admin` | Administrador | All tables and sequences | ALL (SELECT, INSERT, UPDATE, DELETE) |
| `rol_gerente` | Gerente | All tables (SELECT); `usuarios`, `empleados`, `roles` (write) | SELECT all · INSERT/UPDATE on `compras`, `detallecompras` · ALL on `usuarios`, `empleados`, `roles` · **REVOKE DELETE** on `compras`, `detallecompras`, `movimientos` |
| `rol_empleado` | Empleado | `productos`, `categorias`, `proveedores`, `compras`, `detallecompras`, `empleados`, `billeteras`, `usuarios` | SELECT all listed · ALL on `compras`, `detallecompras`, `movimientos`, `billeteras` · **REVOKE DELETE** on financial tables |
| `rol_bodeguero` | Bodeguero | All tables (SELECT); `productos`, `proveedores`, `brinda` (write) | SELECT all · ALL on `productos`, `proveedores`, `brinda` · **REVOKE DELETE** on `productos`, `proveedores` |
| `rol_cliente` | Cliente | `productos`, `categorias` (read); `compras`, `detallecompras`, `billeteras`, `movimientos` (own data) | SELECT on catalog · ALL on `compras`, `detallecompras`, `billeteras`, `movimientos` · **REVOKE DELETE** and **REVOKE UPDATE** on `movimientos` |

### Authentication & Session

- Login and logout are handled via JWT (access token 15 min + refresh token 7 days).
- Tokens are stored in `AuthContext` (React Context) and sent as `Bearer` headers on every API request.
- The backend `protect` middleware verifies the token and attaches the user (with role) to `req.user`.
- The `authorize(...roles)` middleware checks `req.user.rol` against the allowed roles for each route.

### Protected Routes

Backend (`auth.middleware.js` — `authorize(...roles)`):

| Route | Allowed Roles |
|---|---|
| `GET /api/v1/dashboard` | Administrador, Gerente |
| `GET/POST/PUT/DELETE /api/v1/users` | Administrador, Gerente |
| `GET/POST/PUT/DELETE /api/v1/products` | Administrador, Gerente, Empleado, Bodeguero |
| `GET/POST/PUT/DELETE /api/v1/categories` | Administrador, Gerente, Bodeguero |
| `GET/POST/PUT/DELETE /api/v1/providers` | Administrador, Gerente, Bodeguero |
| `GET/POST/PUT /api/v1/provide` | Administrador, Gerente, Bodeguero |
| `GET/POST /api/v1/purchases` | Administrador, Gerente, Empleado, Cliente |
| `GET/PUT /api/v1/wallets` | Administrador, Gerente, Empleado, Cliente |

Frontend (`ProtectedRoute` component + `App.jsx`):

| Route | Allowed Roles |
|---|---|
| `/admin` (Dashboard) | Administrador, Gerente |
| `/admin/users`, `/admin/wallets` | Administrador, Gerente |
| `/admin/purchases` | Administrador, Gerente, Empleado |
| `/admin/categories`, `/admin/providers` | Administrador, Gerente, Bodeguero |
| `/admin/products` | Administrador, Gerente, Empleado, Bodeguero |
| `/cliente/*` | Cliente |

---

## II. Stored Procedures & ORM

### Stored Procedures

All five procedures are defined in `backend/src/db/init/DDL.sql` and invoked from the backend through `backend/src/repositories/procedures.repository.js`. No procedure is called from a standalone SQL script.

#### SP 1 — `sp_obtener_producto` (FUNCTION)

Returns full product information via OUT parameters.

```sql
SELECT * FROM sp_obtener_producto(p_id);
-- OUT: p_nombre, p_precio, p_stock, p_activo, p_categoria, p_id_categoria
```

Invoked from: `procedures.repository.js → spObtenerProducto(id)`

---

#### SP 2 — `sp_desactivar_producto` (FUNCTION — IN/OUT params + exception handling)

Deactivates a product. Uses `IN` and `OUT` parameters and an `EXCEPTION WHEN OTHERS` block.

```sql
SELECT p_success, p_mensaje FROM sp_desactivar_producto(p_id);
-- IN:  p_id INT
-- OUT: p_success BOOLEAN, p_mensaje TEXT
```

Validates that the product exists and is currently active before updating. Returns `p_success = false` with a descriptive message on any failure; catches unexpected errors via `EXCEPTION WHEN OTHERS THEN`.

Invoked from: `procedures.repository.js → spDesactivarProducto(id)` → `product.service.js → deactivateProduct()`

---

#### SP 3 — `sp_activar_producto` (FUNCTION — IN/OUT params + exception handling)

Activates a product. Same IN/OUT + exception pattern as SP 2.

```sql
SELECT p_success, p_mensaje FROM sp_activar_producto(p_id);
-- IN:  p_id INT
-- OUT: p_success BOOLEAN, p_mensaje TEXT
```

Invoked from: `procedures.repository.js → spActivarProducto(id)` → `product.service.js → activateProduct()`

---

#### SP 4 — `sp_recargar_billetera` (FUNCTION — IN/OUT params + exception handling)

Reloads a user's wallet balance. Validates amount > 0 and that the wallet exists before updating.

```sql
SELECT p_nuevo_saldo, p_success, p_mensaje FROM sp_recargar_billetera(p_id_usuario, p_monto);
-- IN:  p_id_usuario INT, p_monto DECIMAL(10,2)
-- OUT: p_nuevo_saldo DECIMAL(10,2), p_success BOOLEAN, p_mensaje TEXT
```

Invoked from: `procedures.repository.js → spRecargarBilletera(userId, amount)` → `wallet.service.js → rechargeWallet()`

---

#### SP 5 — `sp_registrar_suministro` (PROCEDURE — explicit transaction with ROLLBACK)

Registers a supplier supply record. This is a `PROCEDURE` (not a FUNCTION), which allows explicit transaction control (`COMMIT` / `ROLLBACK`) in PostgreSQL.

```sql
CALL sp_registrar_suministro(p_id_proveedor, p_id_producto, p_cantidad);
```

**Transaction flow:**

```
validate cantidad > 0         → ROLLBACK + RAISE EXCEPTION if invalid
validate proveedor is active  → ROLLBACK + RAISE EXCEPTION if not found
validate producto is active   → ROLLBACK + RAISE EXCEPTION if not found
INSERT INTO brinda(...)       -- trigger tgr_update_stock updates stock automatically
COMMIT
```

On any validation failure, `ROLLBACK` is called explicitly before raising the exception. The trigger `tgr_update_stock` fires automatically after the INSERT to update the product's stock.

Invoked from: `procedures.repository.js → spRegistrarSuministro(id_prov, id_prod, cantidad)` → `provide.service.js → createProvide()`

---

### ORM — Prisma v5

**Configuration:** `backend/prisma/schema.prisma` maps all 11 database tables with relations. Binary targets include `linux-musl-openssl-3.0.x` for Docker (Alpine) and `native` for local/Vercel. The client is auto-generated via `postinstall: prisma generate`.

**Client:** `backend/src/config/prisma.js` — singleton `PrismaClient` with the same `DATABASE_URL || individual-vars` fallback as the raw `pg` pool.

The ORM replaces raw SQL in three entities:

#### 1. Categories (`category.orm.repository.js`)

| Operation | Prisma call |
|---|---|
| List (paginated + filter) | `prisma.categorias.findMany` + `prisma.categorias.count` |
| Get by ID | `prisma.categorias.findUnique` |
| Create | `prisma.categorias.create` |
| Update | `prisma.categorias.update` |

Used by: `category.service.js`

#### 2. Providers (`provider.orm.repository.js`)

| Operation | Prisma call |
|---|---|
| List (paginated + filter + showAll) | `prisma.proveedores.findMany` + `prisma.proveedores.count` |
| Get by ID | `prisma.proveedores.findUnique` |
| Create | `prisma.proveedores.create` |
| Update | `prisma.proveedores.update` |
| Deactivate / Activate | `prisma.proveedores.update` (`activo: false/true`) |

Used by: `provider.service.js`

#### 3. Products (`product.orm.repository.js`)

| Operation | Prisma call |
|---|---|
| List (paginated + category + name + showAll) | `prisma.productos.findMany` + `prisma.productos.count` |
| Get by ID | `prisma.productos.findUnique` |
| Create | `prisma.productos.create` |
| Update | `prisma.productos.update` |

> Note: stock-decrement inside purchase transactions remains raw SQL (requires passing a `pg` client for transaction atomicity). Activate/deactivate are handled by SPs 2 and 3.

Used by: `product.service.js`

---

## Test Credentials

The seed script (`insercion.sql`) creates one functional user per database role. Password for all accounts:

```
Password!1
```

| Role | Email | Password |
|---|---|---|
| Administrador | admin@levelup.com | Password!1 |
| Gerente | gerente@levelup.com | Password!1 |
| Empleado | carlos@levelup.com | Password!1 |
| Bodeguero | bodeguero@levelup.com | Password!1 |
| Cliente | juan@gmail.com | Password!1 |

Wallets are created automatically for every user via the database trigger `tgr_create_wallet_user`.

---

## Project Structure

```
LevelUp/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema (all 11 tables)
│   └── src/
│       ├── config/
│       │   ├── db.js             # pg Pool + withTransaction helper
│       │   └── prisma.js         # Prisma singleton client
│       ├── repositories/
│       │   ├── procedures.repository.js   # Invokes all 5 stored procedures
│       │   ├── category.orm.repository.js # ORM — Categorias
│       │   ├── provider.orm.repository.js # ORM — Proveedores
│       │   ├── product.orm.repository.js  # ORM — Productos (basic CRUD)
│       │   └── *.repository.js            # Raw SQL for other entities
│       ├── services/             # Business logic
│       ├── controllers/          # HTTP handlers
│       ├── routes/               # Express routers + authorize() guards
│       ├── middlewares/          # protect, authorize, error handler, logger
│       └── db/
│           └── init/
│               ├── DDL.sql       # Schema + triggers + 5 stored procedures + roles
│               └── insercion.sql # Seed data (one user per role)
│
├── frontend/
│   └── src/
│       ├── App.jsx               # ProtectedRoute guards per role
│       ├── context/
│       │   └── AuthContext.jsx   # JWT session management
│       └── pages/
│           ├── admin/            # Dashboard, Users, Products, Categories, Providers, Purchases, Wallets
│           └── client/           # Store, Profile, MyPurchases, Report
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose (for the Docker setup)
- [Node.js](https://nodejs.org/) v20+ and [PostgreSQL](https://www.postgresql.org/) 16 (for the local setup)

---

## Option 1 — Docker (recommended)

This is the simplest way to run the entire stack (database, API, and frontend) with a single command.

### 1. Clone this repository

```bash
git clone https://github.com/JonathanTubac/Proyecto2-DB-LevelUp.git
```
```bash
git checkout proyecto-3
```
### 2. Copy the `docker-compose.yml` file

**Linux / macOS:**
```bash
cp docker-compose.yml.example docker-compose.yml
```

**Windows (PowerShell):**
```powershell
Copy-Item docker-compose.yml.example docker-compose.yml
```

**Windows (CMD):**
```cmd
copy docker-compose.yml.example docker-compose.yml
```

### 3. Create the root `.env` file

**Linux / macOS:**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Windows (CMD):**
```cmd
copy .env.example .env
```

`.env` content:

```env
PORT=3000
NODE_ENV=production

# Database — used by the postgres container
DB_HOST=postgres
DB_PORT=5432
DB_NAME=levelup
DB_USER=proy3
DB_PASSWORD=your_db_password

# JWT — use long, random strings in production
JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:8080

# Passed as build arg to the frontend container
VITE_API_URL=http://localhost:3001/api/v1
```

> **Important:** `DB_HOST` must stay as `postgres` (the Docker service name). Do not change it.

### 4. Build and start

```bash
docker compose up -d --build
```

On the first run Docker will:
1. Build the custom database image (PostgreSQL 16 + DDL + seed data — including all stored procedures and DBMS roles)
2. Build the backend image (runs `prisma generate` automatically)
3. Build the frontend image (Nginx serving the React build)
4. Wait for the database health check before starting the API

### 5. Access the app

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| API | http://localhost:3001/api/v1 |
| Swagger docs | http://localhost:3001/api-docs |
| PostgreSQL | localhost:5433 |

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

This creates all tables, indexes, triggers, stored procedures, the `dashboard_metrics` view, and the five DBMS roles.

### 2. Configure and start the backend

```bash
cd backend
```

Create `backend/.env`:

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

Install dependencies (this also generates the Prisma client via `postinstall`):

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.

### 3. Configure and start the frontend

Open a new terminal:

```bash
cd frontend
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

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
| Health | `/health` |

---

## Logs

Application logs are written by Winston and mounted at `./logs/` from the host machine (Docker) or the `backend/logs/` directory (local).
