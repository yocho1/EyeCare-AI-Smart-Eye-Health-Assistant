"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import setup_logging
from app.db.session import create_db_and_tables
from app.api import chat, habits, reminders, learning, reading_comfort
from app.schemas import HealthCheck
import logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan."""
    # Startup
    logger.info("EyeCare AI application starting...")
    setup_logging()
    create_db_and_tables()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("EyeCare AI application shutting down...")


# Create FastAPI application
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(habits.router)
app.include_router(reminders.router)
app.include_router(learning.router)
app.include_router(reading_comfort.router)


# Health check endpoint
@app.get("/health", response_model=HealthCheck, tags=["Health"])
async def health_check() -> HealthCheck:
    """Health check endpoint."""
    return HealthCheck(
        status="healthy",
        version=settings.api_version,
        database="connected"
    )


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.api_title,
        "version": settings.api_version,
        "description": settings.api_description,
        "docs": "/docs",
        "disclaimer": "⚠️ This application provides educational information only and is NOT a substitute for professional medical advice."
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
