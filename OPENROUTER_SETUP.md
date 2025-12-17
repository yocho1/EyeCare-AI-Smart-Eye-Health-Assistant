# 🚀 OpenRouter Integration Guide

## What is OpenRouter?

**OpenRouter** is a unified API that provides access to **200+ AI models** through a single endpoint, including:

- **OpenAI models** (GPT-4, GPT-4o-mini)
- **Google Gemini** (Gemini 2.0 Flash)
- **Anthropic Claude** (Claude 3.5 Sonnet)
- **DeepSeek** (DeepSeek R1, V3)
- **Meta Llama** (Llama 3.3)
- **Mistral** and many more

## Why Use OpenRouter?

✅ **Cost-effective** - Prices vary by model, often cheaper than direct APIs  
✅ **Model flexibility** - Switch models without code changes  
✅ **Unified API** - Same interface as OpenAI SDK  
✅ **Load balancing** - Automatic failover between providers  
✅ **Rate limiting** - Better usage tracking  
✅ **No vendor lock-in** - Easy to switch models anytime

---

## Quick Setup (2 minutes)

### 1. Get OpenRouter API Key

1. Go to **https://openrouter.ai**
2. Click **Sign Up** (or Sign In if you have an account)
3. Go to **Keys** in the dashboard
4. Click **Create Key**
5. Copy your API key (starts with `sk-or-v1-`)

### 2. Configure Backend

Edit `backend/.env`:

```env
# Switch to OpenRouter
AI_PROVIDER=openrouter
AI_API_KEY=sk-or-v1-your_key_here

# Optional: Choose different model
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=http://localhost:5173
```

### 3. Start Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

✅ **Done!** Your app now uses OpenRouter

---

## Popular Model Options

### Cost-Effective (Recommended for this project)

```env
# Fast & affordable
OPENROUTER_MODEL=openai/gpt-4o-mini

# Budget option - works great
OPENROUTER_MODEL=deepseek/deepseek-r1

# Fast inference
OPENROUTER_MODEL=google/gemini-2.0-flash
```

### Advanced Models

```env
# Most capable
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Very cheap
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct

# Specialized for reasoning
OPENROUTER_MODEL=deepseek/deepseek-v3
```

---

## Price Comparison

| Model            | Input  | Output | Notes                   |
| ---------------- | ------ | ------ | ----------------------- |
| GPT-4o mini      | $0.15  | $0.60  | Recommended for balance |
| Gemini 2.0 Flash | $0.075 | $0.30  | Very fast               |
| DeepSeek R1      | $0.55  | $2.19  | Cheapest reasoning      |
| Claude 3.5       | $3     | $15    | Most capable            |

_Prices per 1M tokens (as of Dec 2024)_

---

## Testing Your Setup

Once configured, test the OpenRouter integration:

```bash
# Terminal 1: Start backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Start frontend
cd frontend
npm run dev

# Open browser
http://localhost:5173

# Try the AI Chat feature
# Should work seamlessly with OpenRouter
```

---

## Switching Providers

**Easy model switching** - just edit `.env` and restart:

```env
# Try Claude
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Try Llama
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct

# Back to GPT
OPENROUTER_MODEL=openai/gpt-4o-mini
```

No code changes needed! ✨

---

## API Usage Tracking

Monitor your usage on OpenRouter dashboard:

- View costs per model
- Check token usage
- Set spending limits
- View request logs

---

## Troubleshooting

### "Invalid API key"

- Verify you copied the full key (starts with `sk-or-v1-`)
- Check it's in `.env` as `AI_API_KEY`
- Restart backend after editing `.env`

### "Model not found"

- Model name must be exact (e.g., `openai/gpt-4o-mini`)
- Check available models at https://openrouter.ai/docs/models

### "Rate limit exceeded"

- Increase delay between requests
- Check your plan on OpenRouter
- Upgrade plan if needed

### "Timeout error"

- Some models are slower
- Try a faster model like `openai/gpt-4o-mini`
- Check internet connection

---

## Code Integration Details

OpenRouter is integrated in `backend/app/services/ai_service.py`:

```python
class OpenRouterProvider(AIProvider):
    """OpenRouter API provider - supports 200+ models."""

    def __init__(self):
        from openai import OpenAI
        self.client = OpenAI(
            api_key=settings.ai_api_key,
            base_url="https://openrouter.ai/api/v1"  # OpenRouter endpoint
        )
        self.model = settings.openrouter_model
```

Compatible with **OpenAI SDK** - just different endpoint!

---

## Advanced Configuration

### Custom Temperature (Creativity)

```env
# More creative responses (0.0 = deterministic, 1.0 = very creative)
OPENROUTER_TEMPERATURE=0.8

# More focused responses
OPENROUTER_TEMPERATURE=0.3
```

### Custom Site URL

```env
# Used for request tracing on OpenRouter
OPENROUTER_SITE_URL=https://yourdomain.com
```

---

## Benefits for EyeCare AI

✅ **Flexibility** - Try different models for different use cases  
✅ **Cost optimization** - Use cheaper models for simple queries  
✅ **Reliability** - Fallback models if primary fails  
✅ **Scale** - Handle more users without vendor limits  
✅ **Learning** - Compare model outputs easily

---

## Next Steps

1. **Get API Key** - https://openrouter.ai
2. **Update `.env`** - Add your key and choose model
3. **Restart Backend** - `python -m uvicorn app.main:app --reload`
4. **Test Chat** - Click "Chat" on http://localhost:5173
5. **Monitor Usage** - Check OpenRouter dashboard

---

## Resources

📚 **OpenRouter Docs:** https://openrouter.ai/docs  
🔑 **Get API Key:** https://openrouter.ai  
📊 **Models List:** https://openrouter.ai/docs/models  
💬 **Support:** https://openrouter.ai/support

---

**Happy building with OpenRouter! 🚀**

Need help? Check:

1. `FULL_README.md` - Complete setup guide
2. `QUICK_START.md` - 10-minute tutorial
3. OpenRouter docs - Model reference
