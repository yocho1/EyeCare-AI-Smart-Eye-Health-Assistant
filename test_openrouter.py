#!/usr/bin/env python
import sys
import asyncio
from openai import OpenAI

api_key = "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"

print(f"Testing OpenRouter with API key: {api_key[:20]}...")

try:
    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "EyeCare AI"
        }
    )
    
    print("Client initialized successfully")
    print("Making test request...")
    
    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",
        temperature=0.7,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello! Just testing the connection."}
        ]
    )
    
    print("SUCCESS! Got response:")
    print(response.choices[0].message.content[:100])
    
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
