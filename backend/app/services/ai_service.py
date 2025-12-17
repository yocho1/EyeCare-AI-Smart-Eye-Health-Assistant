"""AI service for managing LLM interactions."""
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.core.config import settings
from app.schemas import AIResponse
import json

logger = logging.getLogger(__name__)


class AIProvider(ABC):
    """Abstract base class for AI providers."""
    
    SYSTEM_PROMPT = """You are EyeCare AI, a friendly and supportive educational eye health assistant.

IMPORTANT GUIDELINES:
1. You provide EDUCATIONAL information ONLY, NOT medical advice or diagnoses
2. NEVER diagnose eye conditions or diseases
3. NEVER prescribe medications or treatments
4. ALWAYS include a disclaimer in your responses
5. Encourage healthy digital habits and lifestyle practices
6. Use friendly, supportive, non-judgmental language
7. Keep responses concise and actionable
8. Always format responses as JSON with this structure:
{
    "summary": "Brief 1-2 sentence summary",
    "tips": ["Tip 1", "Tip 2", "Tip 3"],
    "reminder": "Optional personalized reminder"
}

TOPICS YOU CAN HELP WITH:
- Screen time management and digital habits
- Eye strain prevention techniques
- Lighting and ergonomics
- Reading comfort and accessibility
- Healthy work-life balance
- General eye wellness tips
- Understanding how eyes work (educational)
- 20-20-20 rule and break schedules

TOPICS YOU MUST REFUSE:
- Diagnosing eye conditions
- Prescribing treatments or medications
- Advising on eye surgery
- Treating existing eye diseases
- Medical advice (direct users to healthcare professionals)

Always maintain a helpful, encouraging tone while being clear about your limitations."""

    @abstractmethod
    async def generate_response(self, user_message: str, context: Optional[Dict[str, Any]] = None) -> AIResponse:
        """Generate AI response."""
        pass


class GeminiProvider(AIProvider):
    """Google Gemini API provider."""
    
    def __init__(self):
        try:
            import google.generativeai as genai
            self.client = genai.Client(api_key=settings.ai_api_key)
            self.model = settings.gemini_model
            logger.info(f"Gemini provider initialized with model: {self.model}")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini provider: {e}")
            raise

    async def generate_response(
        self, 
        user_message: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> AIResponse:
        """Generate response using Google Gemini."""
        try:
            # Build user prompt with context
            user_prompt = self._build_user_prompt(user_message, context)
            
            # Call Gemini API
            import google.generativeai as genai
            response = genai.GenerativeModel(
                model_name=self.model,
                system_instruction=self.SYSTEM_PROMPT
            ).generate_content(user_prompt)
            
            # Parse response
            response_text = response.text
            
            # Try to extract JSON from response
            ai_data = self._parse_json_response(response_text)
            
            return AIResponse(**ai_data)
            
        except Exception as e:
            logger.error(f"Error generating Gemini response: {e}")
            # Return fallback response
            return AIResponse(
                summary="I encountered an issue. Please try again.",
                tips=["Consider taking a 20-20-20 break"],
                reminder="Remember to rest your eyes regularly"
            )

    def _build_user_prompt(self, message: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Build user prompt with context."""
        prompt = f"{message}"
        
        if context:
            if context.get("time_of_day"):
                prompt += f"\n(Current time: {context['time_of_day']})"
            if context.get("recent_habits"):
                prompt += f"\n(User context: {context['recent_habits']})"
            if context.get("user_preferences"):
                prompt += f"\n(Preferences: {context['user_preferences']})"
        
        return prompt

    def _parse_json_response(self, response_text: str) -> Dict[str, Any]:
        """Extract JSON from AI response."""
        try:
            # Try direct JSON parsing
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        # Fallback: structured response
        return {
            "summary": response_text[:200],
            "tips": [response_text],
            "reminder": "Remember to take regular breaks"
        }


class OpenAIProvider(AIProvider):
    """OpenAI API provider."""
    
    def __init__(self):
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=settings.ai_api_key)
            self.model = settings.openai_model
            logger.info(f"OpenAI provider initialized with model: {self.model}")
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI provider: {e}")
            raise

    async def generate_response(
        self, 
        user_message: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> AIResponse:
        """Generate response using OpenAI."""
        try:
            from openai import OpenAI
            
            # Build user prompt with context
            user_prompt = self._build_user_prompt(user_message, context)
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                temperature=settings.openai_temperature,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            response_text = response.choices[0].message.content
            
            # Parse response
            ai_data = self._parse_json_response(response_text)
            
            return AIResponse(**ai_data)
            
        except Exception as e:
            logger.error(f"Error generating OpenAI response: {e}")
            return AIResponse(
                summary="I encountered an issue. Please try again.",
                tips=["Consider taking a 20-20-20 break"],
                reminder="Remember to rest your eyes regularly"
            )

    def _build_user_prompt(self, message: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Build user prompt with context."""
        prompt = f"{message}"
        
        if context:
            if context.get("time_of_day"):
                prompt += f"\n(Current time: {context['time_of_day']})"
            if context.get("recent_habits"):
                prompt += f"\n(User context: {context['recent_habits']})"
            if context.get("user_preferences"):
                prompt += f"\n(Preferences: {context['user_preferences']})"
        
        return prompt

    def _parse_json_response(self, response_text: str) -> Dict[str, Any]:
        """Extract JSON from AI response."""
        try:
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        return {
            "summary": response_text[:200],
            "tips": [response_text],
            "reminder": "Remember to take regular breaks"
        }


class OpenRouterProvider(AIProvider):
    """OpenRouter API provider - supports multiple models."""
    
    def __init__(self):
        try:
            from openai import OpenAI
            # OpenRouter is compatible with OpenAI's API
            self.site_url = settings.openrouter_site_url
            self.client = OpenAI(
                api_key=settings.ai_api_key,
                base_url="https://openrouter.ai/api/v1",
                default_headers={
                    "HTTP-Referer": self.site_url,
                    "X-Title": "EyeCare AI"
                }
            )
            self.model = settings.openrouter_model
            logger.info(f"OpenRouter provider initialized with model: {self.model}")
        except Exception as e:
            logger.error(f"Failed to initialize OpenRouter provider: {e}")
            raise

    async def generate_response(
        self, 
        user_message: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> AIResponse:
        """Generate response using OpenRouter."""
        try:
            from openai import OpenAI
            import sys
            
            # Build user prompt with context
            user_prompt = self._build_user_prompt(user_message, context)
            
            logger.info(f"Calling OpenRouter API with model: {self.model}")
            logger.info(f"API Key present: {bool(settings.ai_api_key)}")
            logger.info(f"API Key starts with: {settings.ai_api_key[:20] if settings.ai_api_key else 'MISSING'}...")
            
            # Call OpenRouter API (compatible with OpenAI SDK)
            response = self.client.chat.completions.create(
                model=self.model,
                temperature=settings.openrouter_temperature,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            response_text = response.choices[0].message.content
            logger.info(f"OpenRouter response received: {len(response_text)} chars")
            
            # Parse response
            ai_data = self._parse_json_response(response_text)
            
            return AIResponse(**ai_data)
            
        except Exception as e:
            import traceback
            error_type = type(e).__name__
            error_msg = str(e)
            logger.error(f"Error generating OpenRouter response [{error_type}]: {error_msg}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return AIResponse(
                summary="I encountered an issue. Please try again.",
                tips=["Consider taking a 20-20-20 break"],
                reminder="Remember to rest your eyes regularly"
            )

    def _build_user_prompt(self, message: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Build user prompt with context."""
        prompt = f"{message}"
        
        if context:
            if context.get("time_of_day"):
                prompt += f"\n(Current time: {context['time_of_day']})"
            if context.get("recent_habits"):
                prompt += f"\n(User context: {context['recent_habits']})"
            if context.get("user_preferences"):
                prompt += f"\n(Preferences: {context['user_preferences']})"
        
        return prompt

    def _parse_json_response(self, response_text: str) -> Dict[str, Any]:
        """Extract JSON from AI response."""
        try:
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        return {
            "summary": response_text[:200],
            "tips": [response_text],
            "reminder": "Remember to take regular breaks"
        }


class AIService:
    """Service for managing AI interactions."""
    
    def __init__(self):
        self.provider = self._initialize_provider()
    
    def _initialize_provider(self) -> AIProvider:
        """Initialize AI provider based on configuration."""
        provider_name = settings.ai_provider.lower()
        
        if provider_name == "gemini":
            return GeminiProvider()
        elif provider_name == "openai":
            return OpenAIProvider()
        elif provider_name == "openrouter":
            return OpenRouterProvider()
        else:
            raise ValueError(f"Unknown AI provider: {provider_name}. Supported: gemini, openai, openrouter")
    
    async def chat(
        self,
        user_message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> AIResponse:
        """Send a message and get AI response."""
        return await self.provider.generate_response(user_message, context)


# Singleton instance
_ai_service: Optional[AIService] = None


def get_ai_service() -> AIService:
    """Get or create AI service instance."""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
