# 🚀 EyeCare AI - Quick Start Guide

## In 10 Minutes You'll Have:

- ✅ Running FastAPI backend with AI integration
- ✅ Modern React frontend with Tailwind CSS
- ✅ Full database with SQLite
- ✅ 5 complete features working

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- API Key (OpenRouter, Gemini, or OpenAI) - **Free at:**
  - **OpenRouter (Recommended):** https://openrouter.ai - Access 200+ models
  - Gemini: https://aistudio.google.com/
  - OpenAI: https://platform.openai.com/api-keys

---

## Backend Setup (3 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate
# On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment file
cp .env.example .env

# EDIT .env - Add your API key:
# AI_API_KEY=your_actual_key_here

# Run server
python -m uvicorn app.main:app --reload --port 8000
```

✅ **Backend ready at:** http://localhost:8000  
📚 **API Docs at:** http://localhost:8000/docs

---

## Frontend Setup (3 minutes)

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ **Frontend ready at:** http://localhost:5173

---

## Access the App

Open browser: **http://localhost:5173**

---

## Test Each Feature

### 1. 💬 AI Chat

- Click "AI Assistant"
- Ask: "How can I reduce eye strain?"
- Get AI-powered educational response

### 2. 📊 Habits Tracker

- Click "Habits Tracker"
- Log today's screen time and breaks
- View weekly analytics

### 3. 📚 Learning

- Click "Learning"
- Read "Eyes 101" module
- Take the quiz
- See your score

### 4. ⏰ Reminders

- Click "Reminders"
- Create a 20-20-20 reminder
- Enable/disable as needed

### 5. 👁️ Reading Comfort

- Click "Reading Comfort"
- Select device type and lighting
- Get personalized recommendations

---

## Project Files Overview

### Backend Key Files

**`backend/app/main.py`** - FastAPI app entry point  
**`backend/app/api/chat.py`** - AI chat endpoints  
**`backend/app/api/habits.py`** - Habit tracking endpoints  
**`backend/app/api/reminders.py`** - Reminder management  
**`backend/app/api/learning.py`** - Learning modules  
**`backend/app/api/reading_comfort.py`** - Comfort recommendations  
**`backend/app/services/ai_service.py`** - AI provider (OpenRouter/Gemini/OpenAI)  
**`backend/app/models/__init__.py`** - Database models  
**`backend/app/schemas/__init__.py`** - Request/response schemas  
**`backend/.env.example`** - Environment variables template

### Frontend Key Files

**`frontend/src/App.jsx`** - Main app with routing  
**`frontend/src/pages/HomePage.jsx`** - Dashboard  
**`frontend/src/pages/ChatPage.jsx`** - AI chat interface  
**`frontend/src/pages/HabitsPage.jsx`** - Habit tracking UI  
**`frontend/src/pages/LearningPage.jsx`** - Learning modules UI  
**`frontend/src/pages/RemindersPage.jsx`** - Reminders UI  
**`frontend/src/pages/ReadingComfortPage.jsx`** - Comfort settings UI  
**`frontend/src/services/api.js`** - API client  
**`frontend/src/hooks/useApi.js`** - API hook

---

## API Quick Test

### Test with curl or Postman:

```bash
# Health check
curl http://localhost:8000/health

# Get modules
curl http://localhost:8000/api/learning/modules

# Send chat message
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "user_message": "How do I prevent eye strain?",
    "context": {}
  }'
```

Or visit **http://localhost:8000/docs** for interactive API documentation

---

## Troubleshooting

### Backend won't start?

```bash
# Make sure you're in backend directory
cd backend

# Check venv is activated (should see (venv) in terminal)
source venv/bin/activate

# Try installing again
pip install -r requirements.txt

# Then run
python -m uvicorn app.main:app --reload
```

### Frontend won't start?

```bash
# Make sure you're in frontend directory
cd frontend

# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Start
npm run dev
```

### API key not working?

1. Double-check your `.env` file has correct key
2. Make sure you copied entire key (no extra spaces)
3. Try creating a new key
4. Check API provider status

### Port already in use?

```bash
# Change port for backend
python -m uvicorn app.main:app --reload --port 8001

# Change port for frontend (edit vite.config.js)
# Change: port: 5174
```

---

## Next Steps

1. **Customize AI Prompts** - Edit `backend/app/services/ai_service.py`
2. **Add Learning Content** - Edit `backend/app/services/learning_service.py`
3. **Modify UI Styles** - Update Tailwind classes in `frontend/src/`
4. **Deploy** - See `FULL_README.md` for deployment guide

---

## Important Files to Know

| File               | Purpose                        |
| ------------------ | ------------------------------ |
| `.env`             | API keys and configuration     |
| `requirements.txt` | Python dependencies            |
| `package.json`     | Node dependencies              |
| `eyecare.db`       | SQLite database (auto-created) |
| `/docs`            | Interactive API documentation  |

---

## Key Features Implemented

✅ **AI Chat** - OpenRouter/Gemini/OpenAI integration with safety prompts  
✅ **Habit Tracking** - Daily logs with analytics  
✅ **Learning** - 4 modules with quizzes  
✅ **Reminders** - Customizable with notifications  
✅ **Reading Comfort** - Personalized recommendations  
✅ **User Preferences** - Persistent settings  
✅ **Responsive UI** - Mobile-friendly design  
✅ **Error Handling** - Comprehensive validation  
✅ **Logging** - Throughout application  
✅ **Documentation** - Full API docs at `/docs`

---

## Architecture Highlights

- **Backend:** Clean separation (API → Services → DB)
- **Frontend:** Component-based with custom hooks
- **Database:** SQLModel for type safety
- **AI:** Provider abstraction for easy switching
- **Styling:** Tailwind CSS for consistency
- **Performance:** Async/await throughout

---

## What's Included

- 📁 **Complete Backend** - Production-ready FastAPI app
- 📁 **Complete Frontend** - Modern React application
- 🗄️ **Database Models** - 5 fully designed tables
- 🤖 **AI Integration** - OpenRouter, Gemini, and OpenAI support
- 📚 **Learning Content** - 4 educational modules with quizzes
- 🎨 **UI Components** - Reusable, accessible components
- 📖 **Documentation** - Comprehensive README files
- ⚙️ **Configuration** - Environment-based setup

---

## Production Checklist

Before deploying:

- [ ] Change `DEBUG=False` in `.env`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set strong API keys
- [ ] Configure proper `ALLOWED_ORIGINS`
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Configure rate limiting
- [ ] Test all features
- [ ] Run security scan
- [ ] Backup database
- [ ] Set up monitoring

---

## Common Customizations

### Change AI Provider

Edit `backend/.env`:

```env
# Option 1: OpenRouter (recommended - access 200+ models)
AI_PROVIDER=openrouter
AI_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=openai/gpt-4o-mini
# Popular alternatives: deepseek/deepseek-r1, google/gemini-2.0-flash

# Option 2: OpenAI
AI_PROVIDER=openai
AI_API_KEY=sk-...

# Option 3: Gemini
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_key
```

### Modify Safety Disclaimer

Edit `backend/app/services/ai_service.py`:

```python
SYSTEM_PROMPT = "Your custom prompt..."
```

### Add Learning Module

Edit `backend/app/services/learning_service.py`:

```python
"new_module": {
    "id": "new_module",
    "title": "Your Title",
    "content": "Your content...",
    "quiz_questions": [...]
}
```

### Change Colors

Edit `frontend/tailwind.config.js`:

```js
colors: {
    primary: '#your-color',
}
```

---

## Success Indicators

✅ Backend starts without errors  
✅ API docs load at `/docs`  
✅ Frontend builds without errors  
✅ Can log habit entries  
✅ AI responds to messages  
✅ Learning quizzes work  
✅ Reminders can be created  
✅ Preferences save correctly

---

## Support Resources

- **API Docs:** http://localhost:8000/docs
- **Code Comments:** Throughout the codebase
- **README:** `FULL_README.md` for detailed info
- **Examples:** Sample API calls in comments

---

## Time Estimates

- Setup & Install: 10 minutes
- Test all features: 5 minutes
- Customize AI prompts: 10 minutes
- Deploy backend: 15 minutes
- Deploy frontend: 5 minutes

**Total: ~45 minutes from scratch to production-ready**

---

**Version:** 1.0.0  
**Status:** ✅ Ready to Use  
**Last Updated:** January 2025
