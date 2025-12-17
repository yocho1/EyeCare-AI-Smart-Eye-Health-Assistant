"""Database connection and session management."""
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Create database engine
if settings.database_url.startswith("sqlite"):
    # SQLite specific configuration for development
    engine = create_engine(
        settings.database_url,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    engine = create_engine(settings.database_url, echo=False)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)
    logger.info("Database tables created successfully")


def get_session():
    """Dependency to get database session."""
    with Session(engine) as session:
        yield session
