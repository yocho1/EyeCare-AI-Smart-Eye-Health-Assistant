# 🎯 OpenRouter Quick Reference

## One-Minute Setup

```bash
# 1. Get API key from https://openrouter.ai
# 2. Edit backend/.env:
AI_PROVIDER=openrouter
AI_API_KEY=sk-or-v1-your_key_here

# 3. Start backend
cd backend && python -m uvicorn app.main:app --reload

# 4. Start frontend (new terminal)
cd frontend && npm run dev

# 5. Open http://localhost:5173 and test Chat
```

---

## Model Options

| Model              | Command                       | Cost     | Speed     | Best For         |
| ------------------ | ----------------------------- | -------- | --------- | ---------------- |
| **GPT-4o Mini** ⭐ | `openai/gpt-4o-mini`          | Low      | Fast      | General use      |
| DeepSeek R1        | `deepseek/deepseek-r1`        | Lowest   | Medium    | Budget conscious |
| Gemini 2.0         | `google/gemini-2.0-flash`     | Very low | Very fast | Quick responses  |
| Claude 3.5         | `anthropic/claude-3.5-sonnet` | Medium   | Medium    | Best quality     |
| Llama 3.3          | `meta-llama/llama-3.3-70b`    | Low      | Fast      | Open source      |

Add to `.env`:

```env
OPENROUTER_MODEL=openai/gpt-4o-mini
```

---

## Verify It Works

```bash
# Check backend is running
curl http://localhost:8000/health

# Check API docs
http://localhost:8000/docs

# Test chat in frontend
http://localhost:5173 → Click "Chat" → Send message
```

---

## Troubleshooting

| Error             | Solution                                              |
| ----------------- | ----------------------------------------------------- |
| "Invalid API key" | Get key from https://openrouter.ai → Copy full value  |
| "Model not found" | Check model name exactly (e.g., `openai/gpt-4o-mini`) |
| "Rate limited"    | Upgrade plan on OpenRouter                            |
| App won't start   | Restart backend after editing `.env`                  |

---

## Cost Estimation

For average usage (100 messages/day):

- **GPT-4o mini**: ~$0.30/month
- **Gemini 2.0**: ~$0.15/month
- **DeepSeek R1**: ~$0.50/month

---

## Docs & Links

- 🔑 **Get API Key**: https://openrouter.ai
- 📚 **Documentation**: https://openrouter.ai/docs
- 📊 **Model List**: https://openrouter.ai/docs/models
- 💰 **Pricing**: https://openrouter.ai/pricing
- 📖 **Setup Guide**: See `OPENROUTER_SETUP.md`

---

**Questions? Check OPENROUTER_SETUP.md for detailed guide**
