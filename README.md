# 🍄 Mushroom Mate

### Integrated E-Commerce & Cultivation Management System for Sri Lanka

A full-stack web platform that connects mushroom farmers directly with consumers — combining an online marketplace, a farmer inventory dashboard, a knowledge hub, and an admin control panel into one system.

> **HNDIT 4052 — Programming Individual Project**
> B.M.E.G.I Weerasooriya · RAT/IT/2324/F/0012 · SLIATE

---

## ✨ Features

**Customer Portal**
- Browse, search & filter products by category (Oyster, Button, Shiitake, Spawn, Equipment)
- Shopping cart with persistent storage
- Secure checkout & order placement (Cash on Delivery / Bank Transfer)
- Order tracking with live status badges
- Profile management

**Farmer Dashboard**
- Add / edit / delete product listings (full CRUD)
- Real-time inventory tracking with automatic stock deduction on sale
- Low-stock alerts (FR-2)
- Incoming order management with status updates
- Sales analytics with charts (revenue, units, top products)

**Knowledge Hub**
- Cultivation guides & disease-diagnostic references
- Searchable, filterable by type (guide / disease)

**Admin Dashboard**
- Verify / unverify farmer accounts
- Manage all users
- System-wide sales reports with visual charts (FR-7)
- Oversight of every order

**Security & Quality**
- JWT authentication + Bcrypt password hashing
- Role-Based Access Control (Admin / Farmer / Customer / Guest)
- Password policy: 8–12 characters (SRS 5.3)
- Server-side price & stock validation on checkout (transaction-safe)
- Audit logging of key actions
- Fully mobile responsive

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Recharts, Lucide icons, Axios |
| Backend | Node.js, Express, JWT, Bcrypt |
| Database | MySQL 8 |
| Architecture | 3-Tier · RESTful API |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **MySQL** 8+ (XAMPP works well)

### 1. Database setup
Start MySQL, then import the schema (creates the database, tables, and seed data):

```bash
mysql -u root -p < database/schema.sql
```

Or in phpMyAdmin: **Import → choose `database/schema.sql` → Go**.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # then edit .env if your MySQL user/password differ
npm run dev               # starts on http://localhost:5000
```

Default `.env` assumes MySQL on `localhost:3306`, user `root`, no password, database `mushroom_mate`. Adjust as needed.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser. The frontend proxies `/api` to the backend automatically.

---

## 🔑 Demo Accounts


| Role | Email | Notes |
|------|-------|-------|
| Admin | `admin@mushroommate.lk - admin1234

The login page also has one-tap demo buttons for quick testing.

---

## 📁 Project Structure

```
mushroom-mate/
├── backend/
│   ├── config/db.js            # MySQL connection pool
│   ├── controllers/            # auth, product, order, knowledge, admin
│   ├── middleware/auth.js      # JWT protect + RBAC authorize
│   ├── routes/                 # REST route definitions
│   ├── server.js               # Express app entry
│   └── .env.example
├── database/
│   └── schema.sql              # DB schema + Sri Lankan seed data
├── frontend/
│   ├── src/
│   │   ├── api/                # axios client + helpers
│   │   ├── context/            # Auth & Cart context
│   │   ├── components/         # Navbar, Footer, DashboardLayout, ui
│   │   └── pages/              # public / customer / farmer / admin
│   └── vite.config.js
└── README.md
```

---

## 🌐 API Overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` · `/api/auth/login` | Public |
| GET/PUT | `/api/auth/me` | Authenticated |
| GET | `/api/products` · `/api/products/:id` | Public |
| POST/PUT/DELETE | `/api/products` | Farmer/Admin |
| GET | `/api/products/alerts/low` | Farmer |
| POST | `/api/orders` | Customer |
| GET | `/api/orders/my` · `/farmer` · `/` | Role-based |
| PUT | `/api/orders/:id/status` | Farmer/Admin |
| GET | `/api/knowledge` · `/api/knowledge/:id` | Public |
| GET/PUT/DELETE | `/api/admin/*` | Admin |

---

## 📝 Notes
- Code comments are written in **Sinhala** for local maintainability.
- Product images reference Unsplash URLs and load at runtime (internet required for images).
- Online card payments and automated delivery tracking are listed as future enhancements per the proposal.

---

*Growing Together Digitally* 🌱
