# SmartBiz AI

Full-stack business management system with real authentication, an analytics dashboard, and WhatsApp notification automation. Built as a hands-on study of software architecture, applying solid engineering practices across a complete system — from the database to cross-system automation.

## Architecture

Frontend (React + TS) → Backend (FastAPI) → PostgreSQL
│
└──→ n8n (Webhook) → Evolution API → WhatsApp


## Stack

**Frontend**
- React + TypeScript
- Tailwind CSS
- React Router
- Recharts (data visualization)

**Backend**
- FastAPI (Python)
- SQLAlchemy + PostgreSQL
- JWT (authentication) + bcrypt (password hashing)
- Pydantic (data validation)

**Automation**
- n8n (workflow orchestration)
- Evolution API (WhatsApp integration via Docker)

## Features

### Authentication
- Sign up and login with hashed passwords (bcrypt)
- JWT tokens with expiration
- Protected routes on both the frontend (React Router) and backend (FastAPI dependency injection)
- Session persisted via `localStorage`

### Dashboard
- Real-time metrics: monthly revenue, active clients, recorded expenses
- Sales performance chart (last 7 months)
- Recent sales panel
- Attention panel (low stock, high expenses, clients with no purchase history) — calculated dynamically from real data, not simulated

### Clients
- Full CRUD (create, list, edit, delete)
- Quick contact actions: email (`mailto:`) and WhatsApp (`wa.me`)
- Purchase registration linked directly to a client

### Finance
- Standalone expenses
- Purchases linked to clients (generated from the Clients module)
- Real-time balance calculation

### Products
- Full CRUD with stock control
- Automatic low-stock alert reflected on the Dashboard

### WhatsApp Automation
When a purchase is registered for a client, the backend automatically triggers a WhatsApp notification through the following flow:

1. Backend (FastAPI) sends a request to an n8n Webhook
2. n8n processes it and forwards the call to the Evolution API
3. Evolution API sends the message via WhatsApp Web (unofficial mode, suitable for prototyping)

A notification failure never blocks the purchase registration — the dispatch is asynchronous and fault-tolerant.

## Project structure

smartbiz-ai/
backend/
main.py → API routes
models.py → SQLAlchemy models
schemas.py → Pydantic schemas
security.py → password hashing and JWT
notifications.py → n8n/WhatsApp integration
database.py → database connection setup
frontend/
src/
components/ → reusable components
pages/ → application pages
services/ → API calls
context/ → global state (authentication)
types/ → TypeScript types


## Running locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Configure `backend/.env` based on `.env.example`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure `frontend/.env` based on `.env.example`.

### Automation (optional)

WhatsApp automation requires Docker. See the [Evolution API documentation](https://doc.evolution-api.com) to set up a `docker-compose.yml` with Evolution API + n8n + PostgreSQL.

## Security

- Passwords are never stored in plain text (bcrypt)
- Secrets (JWT keys, database credentials, API tokens) live in environment variables and are never committed
- Every protected backend route validates the JWT via dependency injection before executing any business logic

## Roadmap

- [ ] Phone number masking/validation with country code
- [ ] Editing financial transactions
- [ ] Automated tests
- [ ] Production deployment (backend + frontend + database)