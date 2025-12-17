#!/usr/bin/env python
import sys
import os
sys.path.insert(0, 'c:\\Users\\Administrateur\\Desktop\\EyeCare-AI-Smart-Eye-Health-Assistant\\backend')

from app.core.config import settings

print('Provider:', settings.ai_provider)
print('API Key loaded:', bool(settings.ai_api_key))
print('Key starts with:', settings.ai_api_key[:15] if settings.ai_api_key else 'EMPTY')
print('Model:', settings.openrouter_model)
print('Temperature:', settings.openrouter_temperature)
print('Site URL:', settings.openrouter_site_url)
