"""Reading comfort and preference endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.session import get_session
from app.schemas import (
    ReadingComfortRequest,
    ReadingComfortRecommendation,
    UserPreferencesUpdate,
    UserPreferencesResponse
)
from app.services.preference_service import PreferenceService

router = APIRouter(prefix="/api/reading-comfort", tags=["Reading Comfort"])


@router.post("/recommendations", response_model=ReadingComfortRecommendation)
async def get_reading_recommendations(
    user_id: str,
    request: ReadingComfortRequest,
    session: Session = Depends(get_session)
) -> ReadingComfortRecommendation:
    """
    Get personalized reading comfort recommendations.
    
    Based on screen type, lighting, and session duration.
    """
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        # Get user preferences
        preferences = PreferenceService.get_or_create_preferences(session, user_id)
        
        # Generate recommendations based on inputs
        recommendations = _generate_comfort_recommendations(
            request,
            preferences
        )
        
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")


@router.get("/preferences", response_model=UserPreferencesResponse)
async def get_user_preferences(
    user_id: str,
    session: Session = Depends(get_session)
) -> UserPreferencesResponse:
    """Get user's preferences."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        preferences = PreferenceService.get_or_create_preferences(session, user_id)
        return UserPreferencesResponse(
            id=preferences.id,
            user_id=preferences.user_id,
            preferred_font_size=preferences.preferred_font_size,
            preferred_contrast=preferences.preferred_contrast,
            dark_mode=preferences.dark_mode,
            preferred_line_spacing=preferences.preferred_line_spacing,
            preferred_text_width=preferences.preferred_text_width,
            age_range=preferences.age_range,
            working_hours_start=preferences.working_hours_start,
            working_hours_end=preferences.working_hours_end,
            accepts_notifications=preferences.accepts_notifications,
            language=preferences.language,
            created_at=preferences.created_at,
            updated_at=preferences.updated_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching preferences: {str(e)}")


@router.patch("/preferences", response_model=UserPreferencesResponse)
async def update_user_preferences(
    user_id: str,
    preferences_update: UserPreferencesUpdate,
    session: Session = Depends(get_session)
) -> UserPreferencesResponse:
    """Update user's preferences."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        preferences = PreferenceService.update_preferences(
            session,
            user_id,
            preferences_update
        )
        
        return UserPreferencesResponse(
            id=preferences.id,
            user_id=preferences.user_id,
            preferred_font_size=preferences.preferred_font_size,
            preferred_contrast=preferences.preferred_contrast,
            dark_mode=preferences.dark_mode,
            preferred_line_spacing=preferences.preferred_line_spacing,
            preferred_text_width=preferences.preferred_text_width,
            age_range=preferences.age_range,
            working_hours_start=preferences.working_hours_start,
            working_hours_end=preferences.working_hours_end,
            accepts_notifications=preferences.accepts_notifications,
            language=preferences.language,
            created_at=preferences.created_at,
            updated_at=preferences.updated_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating preferences: {str(e)}")


def _generate_comfort_recommendations(
    request: ReadingComfortRequest,
    preferences
) -> ReadingComfortRecommendation:
    """Generate reading comfort recommendations based on context."""
    
    # Base recommendations
    font_size = preferences.preferred_font_size or "medium"
    contrast = preferences.preferred_contrast or "normal"
    line_spacing = preferences.preferred_line_spacing or "normal"
    text_width = preferences.preferred_text_width or "normal"
    background_color = "#1a1a1a" if preferences.dark_mode else "#ffffff"
    
    # Adjust based on session duration
    if request.session_duration_minutes > 60:
        font_size = "large"  # Larger font for long sessions
        line_spacing = "comfortable"  # More comfortable spacing
    
    # Adjust based on lighting
    if request.ambient_light == "dim":
        background_color = "#1a1a1a"
        contrast = "high"
    elif request.ambient_light == "bright":
        background_color = "#ffffff"
        contrast = "normal"
    
    # Device-specific adjustments
    if request.screen_type == "phone":
        font_size = "large"  # Phones are closer
    elif request.screen_type == "tablet":
        font_size = "medium"
    
    # Generate tips
    tips = []
    if request.session_duration_minutes > 30:
        tips.append("Take a 20-20-20 break every 20 minutes")
    
    if request.ambient_light == "dim":
        tips.append("Increase room lighting to reduce eye strain")
    elif request.ambient_light == "bright":
        tips.append("Position screen to avoid glare from bright light")
    
    if request.screen_type in ["phone", "tablet"]:
        tips.append("Hold device further away to reduce accommodation stress")
    
    tips.append("Keep screen at arm's length and slightly below eye level")
    tips.append("Blink frequently to maintain eye moisture")
    
    # Recommend break interval
    if request.session_duration_minutes > 120:
        break_interval = 15
    elif request.session_duration_minutes > 60:
        break_interval = 20
    else:
        break_interval = 20  # Default 20-20-20
    
    return ReadingComfortRecommendation(
        font_size=font_size,
        contrast_level=contrast,
        line_spacing=line_spacing,
        text_width=text_width,
        background_color=background_color,
        recommended_break_interval=break_interval,
        tips=tips
    )
