# AI Bug Report Assistant

A small web app for turning rough bug descriptions into clean, structured reports.
You type what went wrong in plain English, and Google Gemini fills in a proper
title, reproduction steps, priority, module, bug type, and a suggested fix. It
also tries to catch duplicates and gives you a basic analytics dashboard.

I built this because writing consistent bug tickets by hand gets tedious, and
most of the structure is predictable enough for a model to draft.

## Features

- Submit a bug in plain language and get back a structured report.
- Gemini fills in title, steps, priority, module, bug type, and a fix suggestion.
- Duplicate detection against existing bugs.
- Bug list with filtering by priority, module, and status, plus inline status
  updates and delete-with-confirmation.
- Dashboard with total / critical / open / resolved-today counts and recent bugs.
- Analytics page with priority, module, and status charts (Recharts).
- Loading skeletons, empty states, toasts, and confirmation modals.
- Responsive layout via Tailwind breakpoints.

## Tech Stack

Frontend:
- React 18 (Vite)
- Tailwind CSS
- React Router v6
- Axios
- React Context (`BugContext`) for shared state
- Recharts

Backend:
- FastAPI
- SQLite via the built-in `sqlite3` module (no ORM)
- Google Gemini (`google-generativeai`, model `gemini-2.5-flash`)
- python-dotenv
- uvicorn
- pydantic

## Setup

### Backend

```bash
cd backend

# A virtualenv is required on macOS/Homebrew Python.
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# edit .env and set GEMINI_API_KEY=your_actual_key

uvicorn app.main:app --reload
```

If you skip the virtualenv on macOS, pip throws an `externally-managed-environment`
error, which is why the venv step is there.

The backend runs on http://localhost:8000 (docs at `/docs`). A `bugs.db` SQLite
file is created automatically on first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173 and expects the backend on
http://localhost:8000.

## Getting a Gemini API Key

1. Go to https://aistudio.google.com/
2. Sign in with a Google account.
3. Click "Get API key", then "Create API key".
4. Put the key in `backend/.env`:

   ```
   GEMINI_API_KEY=your_actual_key_here
   ```

The `gemini-2.5-flash` model is available on the free tier.

## Folder Structure

```
ai-bug-report-assistant/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/
│   │   │   └── BugContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReportBug.jsx
│   │   │   ├── BugList.jsx
│   │   │   └── Analytics.jsx
│   │   ├── styles/
│   │   │   └── common.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── postcss.config.js
│   └── tailwind.config.js
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── schemas.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── bugs.py
│   │       └── analytics.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/bugs/` | Submit a new bug (runs Gemini analysis) |
| GET | `/bugs/` | Get all bugs (newest first) |
| GET | `/bugs/{id}` | Get a single bug |
| PATCH | `/bugs/{id}/status` | Update status (Open / In Progress / Resolved) |
| DELETE | `/bugs/{id}` | Delete a bug |
| GET | `/analytics/` | Aggregate counts for the dashboard and charts |