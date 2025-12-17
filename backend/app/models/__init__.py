"""Database models for EyeCare application."""
from sqlmodel import SQLModel, Field, Column, String, DateTime, JSON
from typing import Optional, List, Dict, Any
from datetime import datetime
import json


class HabitLog(SQLModel, table=True):
    """User's daily eye habit logs."""
    
    __tablename__ = "habit_logs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    date: datetime = Field(default_factory=datetime.utcnow, index=True)
    
    # Habit tracking data
    screen_time_hours: float = Field(description="Hours spent on screens")
    breaks_taken: int = Field(default=0, description="Number of breaks taken")
    break_duration_minutes: int = Field(default=0, description="Average break duration")
    lighting_quality: str = Field(default="normal", description="Quality of lighting")
    eye_strain_level: int = Field(default=5, description="Self-reported eye strain (1-10)")
    notes: Optional[str] = Field(default=None, description="Additional notes")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class EyeHealthReminder(SQLModel, table=True):
    """Reminders for eye health activities."""
    
    __tablename__ = "eye_health_reminders"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    
    # Reminder configuration
    reminder_type: str = Field(description="Type of reminder: 20-20-20, hydration, etc.")
    interval_minutes: int = Field(description="Interval between reminders in minutes")
    is_enabled: bool = Field(default=True)
    
    # Notification preferences
    use_browser_notification: bool = Field(default=True)
    notification_sound: bool = Field(default=True)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserPreferences(SQLModel, table=True):
    """User preferences and settings."""
    
    __tablename__ = "user_preferences"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    
    # Display preferences
    preferred_font_size: str = Field(default="medium", description="small, medium, large, xlarge")
    preferred_contrast: str = Field(default="normal", description="normal, high")
    dark_mode: bool = Field(default=False)
    
    # Reading preferences
    preferred_line_spacing: str = Field(default="normal", description="normal, comfortable, spacious")
    preferred_text_width: str = Field(default="normal", description="narrow, normal, wide")
    
    # Health data
    age_range: str = Field(default="adult", description="teen, adult, senior")
    working_hours_start: str = Field(default="09:00", description="HH:MM format")
    working_hours_end: str = Field(default="17:00", description="HH:MM format")
    
    # Notification consent
    accepts_notifications: bool = Field(default=True)
    language: str = Field(default="en")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ChatMessage(SQLModel, table=True):
    """Chat history for user interactions with AI assistant."""
    
    __tablename__ = "chat_messages"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    
    # Message content
    user_message: str
    ai_response: str
    
    # Context
    message_type: str = Field(default="general", description="general, habit_related, learning")
    
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class LearningProgress(SQLModel, table=True):
    """Track user's progress in learning modules."""
    
    __tablename__ = "learning_progress"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    
    # Module tracking
    module_id: str = Field(description="Identifier for learning module")
    module_title: str
    completed: bool = Field(default=False)
    quiz_score: Optional[int] = Field(default=None, description="Quiz score as percentage")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)
