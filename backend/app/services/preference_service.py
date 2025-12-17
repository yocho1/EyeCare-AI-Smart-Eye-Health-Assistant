"""Service for user preferences management."""
from sqlmodel import Session, select
from app.models import UserPreferences
from app.schemas import UserPreferencesUpdate, UserPreferencesResponse


class PreferenceService:
    """Service for managing user preferences."""
    
    @staticmethod
    def get_or_create_preferences(
        session: Session,
        user_id: str
    ) -> UserPreferences:
        """Get user preferences or create defaults."""
        statement = select(UserPreferences).where(
            UserPreferences.user_id == user_id
        )
        preferences = session.exec(statement).first()
        
        if not preferences:
            preferences = UserPreferences(user_id=user_id)
            session.add(preferences)
            session.commit()
            session.refresh(preferences)
        
        return preferences
    
    @staticmethod
    def update_preferences(
        session: Session,
        user_id: str,
        preferences_update: UserPreferencesUpdate
    ) -> UserPreferences:
        """Update user preferences."""
        preferences = PreferenceService.get_or_create_preferences(session, user_id)
        
        update_data = preferences_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(preferences, key, value)
        
        preferences.updated_at = __import__('datetime').datetime.utcnow()
        session.add(preferences)
        session.commit()
        session.refresh(preferences)
        
        return preferences
    
    @staticmethod
    def get_reading_comfort_settings(
        session: Session,
        user_id: str
    ) -> dict:
        """Get reading comfort settings for user."""
        preferences = PreferenceService.get_or_create_preferences(session, user_id)
        
        return {
            "font_size": preferences.preferred_font_size,
            "contrast": preferences.preferred_contrast,
            "dark_mode": preferences.dark_mode,
            "line_spacing": preferences.preferred_line_spacing,
            "text_width": preferences.preferred_text_width,
        }
