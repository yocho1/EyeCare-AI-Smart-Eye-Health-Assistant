# 👁️ EyeCare AI — Smart Eye Health Assistant

A production-ready web app that helps users build healthy digital habits with AI-powered guidance, habit tracking, smart reminders (20-20-20), learning modules, and reading-comfort tips.

---

## ✨ Features

- **AI Assistant:** Educational, safety‑guarded eye‑health guidance via OpenRouter/Gemini/OpenAI
- **Habits Tracker:** Daily logs + weekly insights
- **Smart Reminders:** 20‑20‑20 rule with global timer, notifications, sounds
- **Learning:** Interactive modules with quizzes
- **Reading Comfort:** Personalized display recommendations

---

## 🧱 Architecture

- **Backend:** FastAPI, SQLModel/SQLite, Pydantic v2, Uvicorn
- **Frontend:** React 18 + Vite, Tailwind CSS, React Router
- **AI Provider:** OpenRouter (recommended) or Gemini/OpenAI (switch via `.env`)

---

## 🚀 Quick Start

### Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env  # macOS/Linux: cp .env.example .env
# Edit .env → set AI_PROVIDER & AI_API_KEY
python -m uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173

---

## ⚙️ Configuration (backend/.env)

```env
# AI (choose one)
AI_PROVIDER=openrouter   # or: gemini, openai
AI_API_KEY=sk-or-v1-your_key_here

# OpenRouter (recommended)
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_TEMPERATURE=0.7
OPENROUTER_SITE_URL=http://localhost:5173

# Server & CORS
DEBUG=False
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🧪 Tests

We added a `tests/` suite with smoke checks for the FastAPI app.

```bash
# from repo root (with backend venv active)
pytest -q
```

Files:

- tests/test_health.py — verifies `/` and `/health`
- tests/test_config.py — safety placeholder
- tests/test_openrouter.py — safety placeholder

---

## 📂 Project Structure

```
backend/
	app/              # FastAPI app (routers, services, models, schemas)
	requirements.txt
frontend/
	src/              # React app (pages, components, hooks)
	package.json
scripts/
	clean.*           # Cleaning utilities
tests/              # Pytest suite
```

---

## 📚 Documentation

All docs are centralized under the new guides:

- See: guides/DOCUMENTATION_INDEX.md for navigation
- Quick starts, setup, and integration guides included (OpenRouter, etc.)

---

## 🔒 Safety Notice

EyeCare AI provides educational information only and is NOT a substitute for professional medical advice.

---

## 🛣️ Next Steps

- Run both servers and try the Chat, Habits, Reminders, Learning, and Comfort pages
- Switch models via `.env` (OpenRouter recommended)
- Customize prompts/content in backend services and React pages

---

## 📝 License

MIT
