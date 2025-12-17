"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============== Habit Tracking ==============
class HabitLogCreate(BaseModel):
    """Schema for creating habit log entries."""
    screen_time_hours: float = Field(..., ge=0, le=24)
    breaks_taken: int = Field(default=0, ge=0)
    break_duration_minutes: int = Field(default=0, ge=0)
    lighting_quality: str = Field(default="normal")
    eye_strain_level: int = Field(default=5, ge=1, le=10)
    notes: Optional[str] = None


class HabitLogResponse(HabitLogCreate):
    """Schema for habit log responses."""
    id: int
    user_id: str
    date: datetime
    created_at: datetime
    updated_at: datetime


class HabitWeeklySummary(BaseModel):
    """Weekly summary of eye habits."""
    week_start: datetime
    week_end: datetime
    avg_screen_time: float
    avg_strain_level: float
    total_breaks: int
    habit_score: int = Field(description="Score 0-100")
    summary: str = Field(description="AI-generated summary")
    recommendations: List[str]


# ============== Reminders ==============
class ReminderCreate(BaseModel):
    """Schema for creating reminders."""
    reminder_type: str
    interval_minutes: int = Field(..., ge=1)
    use_browser_notification: bool = True
    notification_sound: bool = True


class ReminderUpdate(BaseModel):
    """Schema for updating reminders."""
    is_enabled: Optional[bool] = None
    interval_minutes: Optional[int] = None
    use_browser_notification: Optional[bool] = None
    notification_sound: Optional[bool] = None


class ReminderResponse(ReminderCreate):
    """Schema for reminder responses."""
    id: int
    user_id: str
    is_enabled: bool
    created_at: datetime
    updated_at: datetime


# ============== User Preferences ==============
class UserPreferencesUpdate(BaseModel):
    """Schema for updating user preferences."""
    preferred_font_size: Optional[str] = None
    preferred_contrast: Optional[str] = None
    dark_mode: Optional[bool] = None
    preferred_line_spacing: Optional[str] = None
    preferred_text_width: Optional[str] = None
    age_range: Optional[str] = None
    working_hours_start: Optional[str] = None
    working_hours_end: Optional[str] = None
    accepts_notifications: Optional[bool] = None
    language: Optional[str] = None


class UserPreferencesResponse(UserPreferencesUpdate):
    """Schema for user preferences response."""
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime


# ============== Chat & AI ==============
class ChatMessage(BaseModel):
    """Schema for chat messages."""
    user_message: str = Field(..., min_length=1, max_length=2000)
    context: Optional[dict] = Field(
        default=None,
        description="Additional context like time of day, recent habits"
    )


class AIResponse(BaseModel):
    """Schema for AI assistant responses."""
    summary: str
    tips: List[str]
    reminder: Optional[str] = None
    disclaimer: str = Field(
        default="⚠️ This is educational information only and not medical advice."
    )


class ChatHistory(BaseModel):
    """Schema for chat history."""
    id: int
    user_message: str
    ai_response: str
    message_type: str
    created_at: datetime


# ============== Learning ==============
class LearningModule(BaseModel):
    """Schema for learning modules."""
    id: str
    title: str
    description: str
    content: str
    quiz_questions: Optional[List[dict]] = None


class QuizSubmission(BaseModel):
    """Schema for quiz submissions."""
    module_id: str
    answers: List[int] = Field(description="List of selected answer indices")


class QuizResult(BaseModel):
    """Schema for quiz results."""
    module_id: str
    score: int = Field(description="Score as percentage 0-100")
    passed: bool
    feedback: str


class LearningProgressResponse(BaseModel):
    """Schema for learning progress."""
    module_id: str
    module_title: str
    completed: bool
    quiz_score: Optional[int]
    created_at: datetime
    completed_at: Optional[datetime]


# ============== Reading Comfort ==============
class ReadingComfortRequest(BaseModel):
    """Schema for reading comfort recommendations."""
    screen_type: str = Field(description="phone, tablet, desktop, book")
    ambient_light: str = Field(description="dim, normal, bright")
    session_duration_minutes: int = Field(..., ge=1)
    current_settings: Optional[dict] = None


class ReadingComfortRecommendation(BaseModel):
    """Schema for reading comfort recommendations."""
    font_size: str
    contrast_level: str
    line_spacing: str
    text_width: str
    background_color: str
    recommended_break_interval: int = Field(description="Minutes between breaks")
    tips: List[str]


# ============== Health Check ==============
class HealthCheck(BaseModel):
    """Schema for health check endpoint."""
    status: str
    version: str
    database: str
