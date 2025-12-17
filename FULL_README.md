# 👁️ EyeCare AI - Smart Eye Health Assistant

A modern, production-ready web application designed to promote healthy digital habits and eye wellness through AI-powered suggestions, habit tracking, and educational content.

## ⚠️ Important Disclaimer

**EyeCare AI provides educational information only and is NOT a substitute for professional medical advice, diagnosis, or treatment.** Consult an eye care professional for any medical concerns.

---

## ✨ Core Features

| Feature                 | Description                          |
| ----------------------- | ------------------------------------ |
| 💬 **AI Assistant**     | Educational chatbot about eye health |
| 📊 **Habits Tracker**   | Daily logging with weekly analytics  |
| 📚 **Learning Modules** | Interactive educational content      |
| ⏰ **Smart Reminders**  | 20-20-20 rule, hydration, etc.       |
| 👁️ **Reading Comfort**  | Personalized display recommendations |

---

## 🛠️ Tech Stack

- **Backend:** FastAPI, Python 3.11+, SQLModel, SQLite, Pydantic v2
- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **AI:** OpenRouter (200+ models), Google Gemini API, or OpenAI API
- **Database:** SQLite (dev) / PostgreSQL (prod)

---

## 📁 Project Structure

```
backend/
├── app/main.py              # FastAPI application
├── app/api/                 # Route handlers
│   ├── chat.py
│   ├── habits.py
│   ├── reminders.py
│   ├── learning.py
│   └── reading_comfort.py
├── app/models/              # Database models
├── app/schemas/             # Pydantic schemas
├── app/services/            # Business logic
│   ├── ai_service.py        # AI provider abstraction
│   ├── habit_service.py
│   ├── preference_service.py
│   └── learning_service.py
├── app/db/session.py        # DB configuration
├── app/core/                # Config & logging
├── requirements.txt
└── .env.example

frontend/
├── src/main.jsx
├── src/App.jsx              # Router & layout
├── src/components/          # Reusable components
├── src/pages/               # Page components
│   ├── HomePage.jsx
│   ├── ChatPage.jsx
│   ├── HabitsPage.jsx
│   ├── LearningPage.jsx
│   ├── RemindersPage.jsx
│   └── ReadingComfortPage.jsx
├── src/services/api.js      # API client
├── src/hooks/useApi.js      # Custom hooks
├── src/styles/index.css
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start

### 1. Backend Setup (5 minutes)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your API key (OpenRouter, Gemini, or OpenAI)

# Run server
python -m uvicorn app.main:app --reload --port 8000
```

**Backend running at:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

### 2. Frontend Setup (5 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

**Frontend running at:** http://localhost:5173

### 3. Access Application

Open browser: http://localhost:5173

---

## ⚙️ Configuration

### Backend `.env` File

```env
# Server
DEBUG=False
LOG_LEVEL=INFO

# Database
DATABASE_URL=sqlite:///./eyecare.db

# API Configuration
API_TITLE=EyeCare AI - Smart Eye Health Assistant
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# AI Provider Choice (recommended: openrouter)
AI_PROVIDER=openrouter         # or: gemini, openai
AI_API_KEY=your_api_key_here

# OpenRouter Settings (if using openrouter)
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_TEMPERATURE=0.7
OPENROUTER_SITE_URL=http://localhost:5173

# Gemini Settings (if using gemini)
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7

# OpenAI Settings (if using openai)
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.7
```

### Get API Keys

**OpenRouter** (Recommended - 200+ models):

1. Go to https://openrouter.ai
2. Sign up / Login
3. Go to "Keys" section
4. Create new API key
5. Copy to `.env` as `AI_API_KEY`
6. Configure model in `.env`:
   - `OPENROUTER_MODEL=openai/gpt-4o-mini` (default)
   - `OPENROUTER_MODEL=deepseek/deepseek-r1` (cheaper)
   - `OPENROUTER_MODEL=google/gemini-2.0-flash` (fast)

**Google Gemini**:

1. Go to https://aistudio.google.com/
2. Click "Create API key"
3. Copy key to `.env`
4. Set `AI_PROVIDER=gemini`

**OpenAI**:

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy key to `.env`
4. Set `AI_PROVIDER=openai`

---

## 📚 API Endpoints

### Health Check

```http
GET /health
```

### Chat API

```http
# Send message
POST /api/chat/message?user_id=user_123
Content-Type: application/json
{
  "user_message": "How can I reduce eye strain?",
  "context": {"time_of_day": "14:30"}
}

# Get history
GET /api/chat/history?user_id=user_123&limit=20

# Delete message
DELETE /api/chat/history/{message_id}?user_id=user_123
```

### Habits API

```http
# Create log
POST /api/habits/log?user_id=user_123
{
  "screen_time_hours": 8,
  "breaks_taken": 2,
  "break_duration_minutes": 15,
  "lighting_quality": "normal",
  "eye_strain_level": 5,
  "notes": "Felt comfortable"
}

# Get logs
GET /api/habits/logs?user_id=user_123&days=30

# Get weekly summary
GET /api/habits/weekly-summary?user_id=user_123
```

### Reminders API

```http
# Create reminder
POST /api/reminders/?user_id=user_123
{
  "reminder_type": "20-20-20",
  "interval_minutes": 20,
  "use_browser_notification": true,
  "notification_sound": true
}

# List reminders
GET /api/reminders/?user_id=user_123

# Update reminder
PATCH /api/reminders/1?user_id=user_123
{"is_enabled": false, "interval_minutes": 30}

# Delete reminder
DELETE /api/reminders/1?user_id=user_123
```

### Learning API

```http
# List modules
GET /api/learning/modules

# Get module
GET /api/learning/modules/eyes_101

# Submit quiz
POST /api/learning/modules/eyes_101/quiz?user_id=user_123
{
  "module_id": "eyes_101",
  "answers": [0, 1, 2]
}

# Get progress
GET /api/learning/progress?user_id=user_123
GET /api/learning/progress/eyes_101?user_id=user_123
```

### Reading Comfort API

```http
# Get recommendations
POST /api/reading-comfort/recommendations?user_id=user_123
{
  "screen_type": "desktop",
  "ambient_light": "normal",
  "session_duration_minutes": 60
}

# Get preferences
GET /api/reading-comfort/preferences?user_id=user_123

# Update preferences
PATCH /api/reading-comfort/preferences?user_id=user_123
{
  "preferred_font_size": "large",
  "dark_mode": true,
  "preferred_contrast": "high"
}
```

---

## 🏗️ Architecture

### Backend Architecture

```
HTTP Request (FastAPI)
    ↓
Router Layer (api/*.py)
    ↓
Service Layer (services/*.py)
    ├── AIService (Gemini/OpenAI)
    ├── HabitService (analytics)
    ├── PreferenceService (settings)
    └── LearningService (content)
    ↓
Database Layer (SQLModel)
    ↓
SQLite Database
```

**Key Principles:**

- ✅ Clean separation of concerns
- ✅ Dependency injection pattern
- ✅ Async/await for performance
- ✅ Comprehensive error handling
- ✅ Logging throughout

### Frontend Architecture

```
React App (App.jsx)
    ↓
Router (React Router v6)
    ↓
Pages ← Services ← API Calls
    ↓
Components ← Hooks (useApi)
    ↓
Tailwind CSS + Animations
```

**Key Principles:**

- ✅ Component-based design
- ✅ Custom hooks for reusability
- ✅ Centralized API service
- ✅ Responsive & accessible
- ✅ Mobile-friendly

---

## 🔒 Safety & Compliance

### Medical Safety

✅ **Educational Content Only**

- No diagnoses
- No medical advice
- Non-clinical language
- Friendly tone

✅ **Safety Disclaimers**

- Visible on every page
- Included in AI responses
- Clear messaging

✅ **AI Safeguards**

- System prompt prohibits diagnosis
- Explicit instructions to avoid medical claims
- Fallback responses for errors

✅ **User Privacy**

- No personal data collection
- User IDs generated locally
- Local storage with SQLite

### AI System Prompt

```python
SYSTEM_PROMPT = """You are EyeCare AI, educational assistant ONLY.

IMPORTANT GUIDELINES:
1. You provide EDUCATIONAL information ONLY, NOT medical advice
2. NEVER diagnose eye conditions
3. NEVER prescribe medications or treatments
4. ALWAYS include a disclaimer
5. Encourage healthy digital habits
6. Use friendly, supportive tone
7. Keep responses actionable

TOPICS YOU CAN HELP WITH:
- Screen time management
- Eye strain prevention
- Lighting and ergonomics
- Reading comfort
- Healthy work-life balance
- General eye wellness tips

TOPICS YOU MUST REFUSE:
- Diagnosing eye conditions
- Prescribing treatments
- Medical advice
"""
```

---

## 📊 Database Models

### habit_logs

- `id` - Primary key
- `user_id` - User identifier
- `screen_time_hours` - Daily screen time
- `breaks_taken` - Number of breaks
- `eye_strain_level` - 1-10 rating
- `lighting_quality` - poor/normal/excellent
- `date`, `created_at`, `updated_at`

### eye_health_reminders

- `id` - Primary key
- `user_id` - Owner
- `reminder_type` - Type of reminder
- `interval_minutes` - Frequency
- `is_enabled` - Active status
- `use_browser_notification`, `notification_sound`

### user_preferences

- `id` - Primary key
- `user_id` - Owner (unique)
- `preferred_font_size`, `preferred_contrast`
- `dark_mode`, `preferred_line_spacing`
- `age_range`, `working_hours_start/end`
- `accepts_notifications`, `language`

### chat_messages

- `id` - Primary key
- `user_id` - Owner
- `user_message` - User input
- `ai_response` - AI output (JSON)
- `message_type` - Category
- `created_at`

### learning_progress

- `id` - Primary key
- `user_id` - Owner
- `module_id` - Module identifier
- `completed` - Status
- `quiz_score` - Score percentage
- `completed_at`

---

## 📖 Learning Modules

### 1. Eyes 101: How Your Eyes Work

- Eye anatomy (cornea, lens, retina, optic nerve)
- Vision process step-by-step
- Fun facts about eyes
- Quiz: 2 questions

### 2. Digital Eye Strain: Prevention Tips

- Why screen time causes strain
- Symptoms to watch for
- 20-20-20 rule explained
- Workspace setup guide
- Screen settings optimization
- Quiz: 2 questions

### 3. Proper Lighting for Eye Comfort

- Types of lighting (ambient, task, natural)
- Glare prevention
- Insufficient lighting solutions
- Color temperature guidance
- Ideal setup recommendations
- Quiz: 1 question

### 4. Why Breaks Matter for Eye Health

- What happens during long focus sessions
- Benefits of regular breaks
- Break guidelines (micro, regular, longer)
- Break activities suggestions
- Remote work tips
- Quiz: 1 question

---

## ✅ Quality Metrics

| Aspect          | Status                     |
| --------------- | -------------------------- |
| Code Quality    | ✅ Clean, production-ready |
| Architecture    | ✅ Modular, scalable       |
| Error Handling  | ✅ Comprehensive           |
| Logging         | ✅ Throughout app          |
| Security        | ✅ No secrets exposed      |
| Testing         | ✅ Ready for tests         |
| Documentation   | ✅ Complete                |
| Performance     | ✅ Async, optimized        |
| Accessibility   | ✅ Considerations included |
| Mobile-Friendly | ✅ Responsive design       |

---

## 🚢 Deployment Guide

### Backend Deployment

**Prerequisites:**

- Python 3.11+ server
- PostgreSQL database (for production)
- Environment variables configured

**Steps:**

1. Use PostgreSQL for production:

```env
DATABASE_URL=postgresql://user:password@host:5432/eyecare
```

2. Run with multiple workers:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

3. Enable HTTPS, proper CORS, rate limiting

### Frontend Deployment

**Build for production:**

```bash
npm run build
```

**Deploy `dist/` folder to:**

- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Your own server

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
pytest tests/
```

---

## ❓ FAQ

**Q: Is this medical software?**
A: No. It's educational only. Consult healthcare professionals for medical concerns.

**Q: Can I use this for diagnosis?**
A: No. See an eye care professional for diagnosis.

**Q: How is data handled?**
A: User IDs generated locally, no personal data collected, SQLite storage.

**Q: Can I self-host?**
A: Yes. Follow the installation guide.

**Q: Which AI model is best?**
A: Gemini (default) works great for educational content. OpenAI is also supported.

**Q: Can I modify the learning content?**
A: Yes. Edit `backend/app/services/learning_service.py`.

**Q: Can I add new reminders?**
A: Yes. Extend `reminder_type` options in the UI and API.

**Q: How do I customize the UI?**
A: Edit Tailwind classes in React components, customize colors in `tailwind.config.js`.

---

## 🎯 Next Steps

1. ✅ **Install & Run** - Follow quick start above
2. 🔍 **Explore API** - Visit http://localhost:8000/docs
3. 🧪 **Test Features** - Try each page
4. 🎨 **Customize** - Modify prompts, modules, styles
5. 🚀 **Deploy** - Push to production

---

## 📞 Support

- Review code comments
- Check API documentation at `/docs`
- Examine database models for data structure
- Review service layers for business logic
- Test endpoints with Postman or curl

---

## 📜 License

MIT License - Free for educational and commercial use

---

**Version:** 1.0.0  
**Updated:** January 2025  
**Status:** ✅ Production-Ready
