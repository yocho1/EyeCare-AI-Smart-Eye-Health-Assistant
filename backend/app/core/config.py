"""Core configuration for the application."""
from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    api_title: str = "EyeCare AI - Smart Eye Health Assistant"
    api_version: str = "1.0.0"
    api_description: str = "Educational Eye Health Assistant"
    debug: bool = False
    log_level: str = "INFO"
    
    # Database
    database_url: str = "sqlite:///./eyecare.db"
    
    # CORS - hardcoded, no parsing needed
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # AI Provider Configuration
    ai_provider: str = "openrouter"  # gemini, openai, or openrouter
    ai_api_key: str = ""
    
    # Gemini
    gemini_model: str = "gemini-2.0-flash-exp"
    gemini_temperature: float = 0.7
    
    # OpenAI
    openai_model: str = "gpt-4o-mini"
    openai_temperature: float = 0.7
    
    # OpenRouter
    openrouter_model: str = "openai/gpt-4o-mini"
    openrouter_temperature: float = 0.7
    openrouter_site_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = False
        
    def get_allowed_origins(self) -> List[str]:
        """Parse allowed origins from config string."""
        if isinstance(self.allowed_origins, str):
            return [o.strip() for o in self.allowed_origins.split(',') if o.strip()]
        return self.allowed_origins if isinstance(self.allowed_origins, list) else []


@lru_cache()
def get_settings():
    """Get cached settings instance."""
    return Settings()


settings = get_settings()

