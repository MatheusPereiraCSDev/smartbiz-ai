# SmartBiz AI

Full-stack business management system with real authentication, an analytics dashboard, AI-powered insights, and WhatsApp notification automation. Built as a hands-on study of software architecture, applying solid engineering practices across a complete system — from the database to cross-system automation and production deployment.

🔗 **Live demo:** https://gest-o-empresarial-ten.vercel.app
📦 **API docs:** https://smartbiz-ai-8imi.onrender.com/docs

> Note: the backend runs on Render's free tier and may take 30–60 seconds to wake up after a period of inactivity.

## Architecture

Frontend (React + TS) → Backend (FastAPI) → PostgreSQL (Neon)
│
├──→ Groq API (GPT Oss 120B) — AI insights
│
└──→ n8n (Webhook) → Evolution API → WhatsApp


Deployed across three services: **Vercel** (frontend), **Render** (backend), **Neon** (database).

## Stack

**Frontend**
- React + TypeScript
- Tailwind CSS
- React Router
- Recharts (data visualization)
- Vitest + React Testing Library (testing)

**Backend**
- FastAPI (Python)
- SQLAlchemy + PostgreSQL
- JWT (authentication) + bcrypt (password hashing)
- Pydantic (data validation)
- Pytest (testing)

**AI**
- Groq API (Llama 3.3 70B) — automated business insights generated from real dashboard data

**Automation**
- n8n (workflow orchestration)
- Evolution API (WhatsApp integration via Docker)

**Infrastructure**
- Neon — managed PostgreSQL (production)
- Render — backend hosting
- Vercel — frontend hosting

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
- **AI-generated insights**: plain-language, actionable summaries of the business's current state, generated on-demand from live data

### Clients
- Full CRUD (create, list, edit, delete)
- Quick contact actions: email (`mailto:`) and WhatsApp (`wa.me`)
- Purchase registration linked directly to a client
- Deletion is blocked with a clear error message if the client has linked transactions, preserving financial record integrity

### Finance
- Standalone expenses (editable)
- Purchases linked to clients (generated from the Clients module)
- Real-time balance calculation
- Search across description and client name

### Products
- Full CRUD with stock control
- Automatic low-stock alert reflected on the Dashboard

### WhatsApp Automation
When a purchase is registered for a client, the backend automatically triggers a WhatsApp notification through the following flow:

1. Backend (FastAPI) sends a request to an n8n Webhook
2. n8n processes it and forwards the call to the Evolution API
3. Evolution API sends the message via WhatsApp Web (unofficial mode, suitable for prototyping)

A notification failure never blocks the purchase registration — the dispatch is asynchronous and fault-tolerant. This automation is demonstrated locally (via Docker) and is not part of the live production deployment.

## Testing

- **Backend**: 24+ automated tests (pytest) covering authentication, protected routes, and full CRUD + business rules for Clients, Products, and Finance (including client-linked purchases and integrity constraints)
- **Frontend**: component and context tests (Vitest + React Testing Library) covering UI components, forms, and authentication state

## Project structure

smartbiz-ai/
backend/
main.py → API routes
models.py → SQLAlchemy models
schemas.py → Pydantic schemas
security.py → password hashing and JWT
notifications.py → n8n/WhatsApp integration
ai_insights.py → AI-generated dashboard insights
database.py → database connection setup
tests/ → pytest test suite
frontend/
src/
components/ → reusable components
pages/ → application pages
services/ → API calls
context/ → global state (authentication)
types/ → TypeScript types
tests/ → Vitest test suite


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

Run tests:
```bash
pytest -v
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure `frontend/.env` based on `.env.example`.

Run tests:
```bash
npx vitest run
```

### Automation (optional)

WhatsApp automation requires Docker. See the [Evolution API documentation](https://doc.evolution-api.com) to set up a `docker-compose.yml` with Evolution API + n8n + PostgreSQL.

## Security

- Passwords are never stored in plain text (bcrypt)
- Secrets (JWT keys, database credentials, API tokens) live in environment variables and are never committed — verified against the full Git history, not just the current file tree
- Every protected backend route validates the JWT via dependency injection before executing any business logic
- Referential integrity is enforced at the database level (e.g. clients with linked transactions cannot be deleted)

## Roadmap

- [ ] Rate limiting on authentication endpoints
- [ ] Phone number masking/validation with country code
- [ ] Pagination for large datasets
- [ ] User roles (admin/staff)
- [ ] Expand frontend test coverage
