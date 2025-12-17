"""Eye habits tracking endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.session import get_session
from app.schemas import HabitLogCreate, HabitLogResponse, HabitWeeklySummary
from app.services.habit_service import HabitService
from typing import List

router = APIRouter(prefix="/api/habits", tags=["Habits"])


@router.post("/log", response_model=HabitLogResponse)
async def create_habit_log(
    user_id: str,
    habit_log: HabitLogCreate,
    session: Session = Depends(get_session)
) -> HabitLogResponse:
    """
    Create a new habit log entry.
    
    Track daily screen time, breaks, lighting, and eye strain.
    """
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        log = HabitService.create_habit_log(session, user_id, habit_log)
        return HabitLogResponse(
            id=log.id,
            user_id=log.user_id,
            date=log.date,
            screen_time_hours=log.screen_time_hours,
            breaks_taken=log.breaks_taken,
            break_duration_minutes=log.break_duration_minutes,
            lighting_quality=log.lighting_quality,
            eye_strain_level=log.eye_strain_level,
            notes=log.notes,
            created_at=log.created_at,
            updated_at=log.updated_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating habit log: {str(e)}")


@router.get("/logs", response_model=List[HabitLogResponse])
async def get_habit_logs(
    user_id: str,
    days: int = 30,
    session: Session = Depends(get_session)
) -> List[HabitLogResponse]:
    """
    Get user's habit logs.
    
    Returns logs from the past N days (default 30).
    """
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        logs = HabitService.get_user_habit_logs(session, user_id, days)
        return [
            HabitLogResponse(
                id=log.id,
                user_id=log.user_id,
                date=log.date,
                screen_time_hours=log.screen_time_hours,
                breaks_taken=log.breaks_taken,
                break_duration_minutes=log.break_duration_minutes,
                lighting_quality=log.lighting_quality,
                eye_strain_level=log.eye_strain_level,
                notes=log.notes,
                created_at=log.created_at,
                updated_at=log.updated_at
            )
            for log in logs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching habit logs: {str(e)}")


@router.get("/weekly-summary", response_model=HabitWeeklySummary)
async def get_weekly_summary(
    user_id: str,
    session: Session = Depends(get_session)
) -> HabitWeeklySummary:
    """
    Get weekly habit summary.
    
    Returns aggregate stats and recommendations for the past week.
    """
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        summary = HabitService.get_weekly_summary(session, user_id)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")
