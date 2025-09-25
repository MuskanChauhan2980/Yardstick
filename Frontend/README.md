# Multi-Tenant SaaS Notes Application

A multi-tenant Notes application built with role-based access, subscription limits, and tenant isolation. The application is fully deployed on **Vercel** for both frontend and backend, with the database hosted on **Railway**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture & Approach](#architecture--approach)
- [Authentication & Authorization](#authentication--authorization)
- [Subscription Feature Gating](#subscription-feature-gating)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Deployment](#deployment)
- [Predefined Test Accounts](#predefined-test-accounts)
- [Usage](#usage)
- [License](#license)

---

## Project Overview

This project implements a **multi-tenant SaaS Notes Application** where multiple companies (tenants) can manage their users and notes securely. Tenants are strictly isolated, and role-based access ensures admins and members have appropriate permissions.

The system supports subscription-based feature gating (Free vs Pro) and is designed for real-world SaaS deployment.

---

## Features

- Multi-Tenancy with strict tenant isolation
- JWT-based authentication
- Role-based access control (Admin vs Member)
- CRUD operations for notes
- Subscription limits (Free: 3 notes, Pro: unlimited)
- Upgrade endpoint for subscription
- Minimal frontend for login, note management, and upgrade prompts
- Health check endpoint (`GET /`)

---

## Architecture & Approach

### Multi-Tenancy Approach
- **Shared Schema with Tenant ID Column**:  
  All notes and users belong to a specific tenant using a `tenantId` column. This approach simplifies database management while maintaining strict tenant isolation.
- **Tenant Isolation Enforcement**:  
  Every API request filters data by the tenant ID extracted from the logged-in user's JWT token.

### Tech Stack
- Backend: Node.js, Express.js
- Database: MySQL (hosted on Railway)
- Frontend: React.js (hosted on Vercel)
- Authentication: JWT
- Deployment: Vercel (frontend + backend)

---

## Authentication & Authorization

- **JWT-Based Login**: Secures access for tenants and users.
- **Roles**:
  - **Admin**: Can invite users and upgrade subscriptions.
  - **Member**: Can create, view, edit, and delete notes.

---

## Subscription Feature Gating

- **Free Plan**: Tenant limited to a maximum of 3 notes.
- **Pro Plan**: Unlimited notes.
- **Upgrade Endpoint**: `POST /tenants/:slug/upgrade` (Admin only)
  - Lifts note limit immediately for the tenant.

---

## API Endpoints

**Notes CRUD (tenant isolated & role enforced):**
- `POST /notes` – Create a note
- `GET /notes` – List all notes for the current tenant
- `GET /notes/:id` – Retrieve a specific note
- `PUT /notes/:id` – Update a note
- `DELETE /notes/:id` – Delete a note

**Tenant Upgrade:**
- `POST /tenants/:slug/upgrade` – Upgrade tenant to Pro plan

**Health Check:**
- `GET /` → `{ "status": "ok" }`

---

## Frontend

The frontend supports:
- Login using predefined accounts
- Listing, creating, editing, and deleting notes
- Upgrade prompt when Free tenant reaches the note limit

---

## Deployment

- **Frontend & Backend:** Hosted on [Vercel](https://vercel.com/)
- **Database:** Hosted on [Railway](https://railway.app/)
- **CORS:** Enabled for automated scripts and dashboards

---

## Predefined Test Accounts

| Email | Role | Tenant | Password |
|-------|------|--------|----------|
| admin@acme.test | Admin | Acme | password |
| user@acme.test | Member | Acme | password |
| admin@globex.test | Admin | Globex | password |
| user@globex.test | Member | Globex | password |

---

## Usage

1. **Clone the repository**
   ```bash
   git clone <https://github.com/MuskanChauhan2980/Yardstick.git>
   cd  Backend ---- for run backend
   cd Frontend ---- for run frontend 


## Architecture & Approach

### Multi-Tenancy Approach
- **Shared Schema with Tenant ID Column**:  
  All notes and users belong to a specific tenant using a `tenantId` column. This approach simplifies database management while maintaining strict tenant isolation.
- **Tenant Isolation Enforcement**:  
  Every API request filters data by the tenant ID extracted from the logged-in user's JWT token.

### Tech Stack
- Backend: Node.js, Express.js
- Database: MySQL (hosted on Railway)
- Frontend: React.js (hosted on Vercel)
- Authentication: JWT
- Deployment: Vercel (frontend + backend)

---

## Project Architecture Diagram

```text
           +------------------+
           |    Frontend      | (React on Vercel)
           +--------+---------+
                    |
                    | API Requests (JWT Auth)
                    v
           +--------+---------+
           |     Backend      | (Node.js + Express on Vercel)
           +--------+---------+
                    |
        +-----------+-----------+
        |                       |
+-------v-------+       +-------v-------+
|  Users Table  |       |  Notes Table  |
| tenantId col  |       | tenantId col  |
+---------------+       +---------------+
        |
        v
   MySQL Database (Railway)