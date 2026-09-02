# SmartBiz AI — Setup Guide

This guide walks through setting up the entire SmartBiz AI system from scratch: backend, frontend, AI insights, and the optional WhatsApp automation.

> Looking for the live version instead of running it locally? Check the **Live demo** link in the [README](./README.md).

## Prerequisites

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/) (running locally or accessible remotely)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (only required for the WhatsApp automation)
- [Git](https://git-scm.com/downloads)
- A free [Groq](https://console.groq.com) API key (for AI-generated dashboard insights)

---

## 1. Clone the repository

```bash
git clone https://github.com/<your-username>/smartbiz-ai.git
cd smartbiz-ai
```

---

## 2. Backend setup (FastAPI)

### 2.1 Create and activate a virtual environment

```bash
cd backend
python -m venv venv
```

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 2.2 Install dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Create the database

Using `psql` or a GUI tool like pgAdmin, create an empty database:

```sql
CREATE DATABASE smartbiz_db;
```

### 2.4 Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Edit `backend/.env`:

DATABASE_URL=postgresql://<user>:<password>@localhost:5432/smartbiz_db
SECRET_KEY=<generate a random secret key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GROQ_API_KEY=<your Groq API key>
N8N_WEBHOOK_URL=http://localhost:5678/webhook/enviar-mensagem


To generate a strong `SECRET_KEY`:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

To get a free `GROQ_API_KEY`, sign up at [console.groq.com](https://console.groq.com) — no credit card required.

### 2.5 Run the backend

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

Tables are created automatically on first run (via SQLAlchemy).

### 2.6 Run the backend tests (optional)

```bash
pytest -v
```

Tests run against an isolated in-memory SQLite database — they never touch your local or production PostgreSQL data.

---

## 3. Frontend setup (React + TypeScript)

### 3.1 Install dependencies

```bash
cd frontend
npm install
```

### 3.2 Configure environment variables

```bash
cp .env.example .env
```

Edit `frontend/.env`:

VITE_API_URL=http://localhost:8000


### 3.3 Run the frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3.4 Run the frontend tests (optional)

```bash
npx vitest run
```

### 3.5 Create your first account

Open `http://localhost:5173`, click **"Cadastre-se"**, and create a user. Then log in — you'll be redirected to the dashboard.

---

## 4. WhatsApp automation setup (optional)

This step is only needed if you want purchase notifications to be sent automatically via WhatsApp. The rest of the system — including AI insights — works fully without it.

### 4.1 Enable virtualization (Windows only, if Docker fails to start)

Ensure virtualization is enabled in your BIOS, then run in an elevated PowerShell:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
wsl --set-default-version 2
```

Restart your machine and open Docker Desktop.

### 4.2 Create a separate folder for the automation stack

```bash
mkdir automation
cd automation
```

### 4.3 Create the `.env` file

EVOLUTION_API_KEY=<choose a strong key>
POSTGRES_PASSWORD=<choose a strong password>


### 4.4 Create `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: evolution_postgres
    restart: always
    environment:
      - POSTGRES_USER=evolution
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=evolution
    volumes:
      - evolution_postgres_data:/var/lib/postgresql/data

  evolution-api:
    container_name: evolution_api
    image: evoapicloud/evolution-api:v2.3.0
    restart: always
    ports:
      - "8081:8080"
    environment:
      - AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://evolution:${POSTGRES_PASSWORD}@postgres:5432/evolution
      - CACHE_REDIS_ENABLED=false
      - CACHE_LOCAL_ENABLED=true
    volumes:
      - evolution_instances:/evolution/instances
    depends_on:
      - postgres

  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - GENERIC_TIMEZONE=America/Sao_Paulo
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  evolution_instances:
  n8n_data:
  evolution_postgres_data:
```

### 4.5 Start the containers

```bash
docker compose up -d
docker ps
```

All three containers (`evolution_api`, `evolution_postgres`, `n8n`) should show as `Up`.

### 4.6 Create a WhatsApp instance

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/instance/create" -Method Post -Headers @{ "apikey" = "<your EVOLUTION_API_KEY>" } -ContentType "application/json" -Body '{"instanceName": "smartbiz", "integration": "WHATSAPP-BAILEYS"}'
```

### 4.7 Get and scan the QR code

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8081/instance/connect/smartbiz" -Method Get -Headers @{ "apikey" = "<your EVOLUTION_API_KEY>" }
$base64 = $response.base64 -replace "data:image/png;base64,", ""
[System.Convert]::FromBase64String($base64) | Set-Content -Path "qrcode.png" -Encoding Byte
start qrcode.png
```

Scan the QR code with WhatsApp: **Settings → Linked Devices → Link a Device**.

### 4.8 Build the n8n workflow

1. Open `http://localhost:5678` and create your local account
2. Create a new workflow
3. Add a **Webhook** node (Method: `POST`, Path: `enviar-mensagem`)
4. Add an **HTTP Request** node connected to the Webhook:
   - Method: `POST`
   - URL: `http://evolution-api:8080/message/sendText/smartbiz`
   - Headers: `apikey` = `<your EVOLUTION_API_KEY>`, `Content-Type` = `application/json`
   - Body (JSON):
```json
     {
       "number": "{{ $json.body.number }}",
       "text": "{{ $json.body.text }}"
     }
```
5. Click **Publish** to activate the workflow

### 4.9 Copy the production Webhook URL

Double-click the Webhook node and copy the **Production URL** (e.g. `http://localhost:5678/webhook/enviar-mensagem`). Make sure this matches `N8N_WEBHOOK_URL` in your `backend/.env`.

### 4.10 Test it

Register a purchase for a client with a valid phone number (including country code, e.g. `5511999999999`) through the SmartBiz AI UI. The client should automatically receive a WhatsApp message confirming the purchase.

---

## 5. Running everything together

Once set up, day-to-day usage requires two terminals (three if using WhatsApp automation):

**Terminal 1 — Backend**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

**Terminal 3 — Automation (optional)**
```bash
cd automation
docker compose up -d
```

Then open `http://localhost:5173` in your browser.

---

## Deploying to production

The live demo runs on:
- **Neon** — managed PostgreSQL
- **Render** — backend (Web Service, Root Directory: `backend`, Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`)
- **Vercel** — frontend (Root Directory: `frontend`)

Key points if replicating this setup:
- Set the same environment variables listed in step 2.4 on Render (WhatsApp automation excluded — it isn't part of the production deployment)
- Set `VITE_API_URL` on Vercel to your Render backend URL
- Update the CORS `origins` list in `backend/main.py` to include your Vercel domain
- Add a `vercel.json` with SPA rewrites in `frontend/` so client-side routes don't 404 on refresh:
```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
```

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `net::ERR_CONNECTION_REFUSED` in the browser console | Backend isn't running |
| `psycopg2.errors.UndefinedColumn` | Database schema is out of sync — drop the affected table and restart the backend to let SQLAlchemy recreate it |
| `psycopg2.errors.ForeignKeyViolation` when deleting a client/record | Expected behavior — the record has linked transactions; delete those first or keep the record for historical integrity |
| Evolution API container stuck in `Restarting` | Check `docker logs evolution_api` — usually a missing database configuration |
| WhatsApp message not sent | Confirm the n8n workflow is **Published** (not just tested) and the client's phone includes the country code |
| CORS error in production (`No 'Access-Control-Allow-Origin' header`) | Usually a symptom of a backend 500 error, not an actual CORS misconfiguration — check the Render logs for the real exception |
| 404 on page refresh in production (Vercel) | Missing `vercel.json` SPA rewrite — see "Deploying to production" above |
| Backend responds slowly on first request in production | Render's free tier sleeps after 15 minutes of inactivity — the first request wakes it up (30–60s) |
