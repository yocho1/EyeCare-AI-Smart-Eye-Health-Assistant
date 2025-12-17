"""Reminders and notifications endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_session
from app.models import EyeHealthReminder
from app.schemas import ReminderCreate, ReminderUpdate, ReminderResponse
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/reminders", tags=["Reminders"])


@router.post("/", response_model=ReminderResponse)
async def create_reminder(
    user_id: str,
    reminder: ReminderCreate,
    session: Session = Depends(get_session)
) -> ReminderResponse:
    """
    Create a new reminder.
    
    Supports reminders like 20-20-20 rule, hydration, etc.
    """
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    if reminder.interval_minutes < 1:
        raise HTTPException(status_code=400, detail="Interval must be at least 1 minute")
    
    try:
        db_reminder = EyeHealthReminder(
            user_id=user_id,
            reminder_type=reminder.reminder_type,
            interval_minutes=reminder.interval_minutes,
            use_browser_notification=reminder.use_browser_notification,
            notification_sound=reminder.notification_sound
        )
        session.add(db_reminder)
        session.commit()
        session.refresh(db_reminder)
        
        return ReminderResponse(
            id=db_reminder.id,
            user_id=db_reminder.user_id,
            reminder_type=db_reminder.reminder_type,
            interval_minutes=db_reminder.interval_minutes,
            use_browser_notification=db_reminder.use_browser_notification,
            notification_sound=db_reminder.notification_sound,
            is_enabled=db_reminder.is_enabled,
            created_at=db_reminder.created_at,
            updated_at=db_reminder.updated_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating reminder: {str(e)}")


@router.get("/", response_model=List[ReminderResponse])
async def list_reminders(
    user_id: str,
    session: Session = Depends(get_session)
) -> List[ReminderResponse]:
    """Get all reminders for a user."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        statement = select(EyeHealthReminder).where(
            EyeHealthReminder.user_id == user_id
        )
        reminders = session.exec(statement).all()
        
        return [
            ReminderResponse(
                id=r.id,
                user_id=r.user_id,
                reminder_type=r.reminder_type,
                interval_minutes=r.interval_minutes,
                use_browser_notification=r.use_browser_notification,
                notification_sound=r.notification_sound,
                is_enabled=r.is_enabled,
                created_at=r.created_at,
                updated_at=r.updated_at
            )
            for r in reminders
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reminders: {str(e)}")


@router.patch("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(
    user_id: str,
    reminder_id: int,
    reminder_update: ReminderUpdate,
    session: Session = Depends(get_session)
) -> ReminderResponse:
    """Update a reminder."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        statement = select(EyeHealthReminder).where(
            EyeHealthReminder.id == reminder_id,
            EyeHealthReminder.user_id == user_id
        )
        reminder = session.exec(statement).first()
        
        if not reminder:
            raise HTTPException(status_code=404, detail="Reminder not found")
        
        update_data = reminder_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(reminder, key, value)
        
        reminder.updated_at = datetime.utcnow()
        session.add(reminder)
        session.commit()
        session.refresh(reminder)
        
        return ReminderResponse(
            id=reminder.id,
            user_id=reminder.user_id,
            reminder_type=reminder.reminder_type,
            interval_minutes=reminder.interval_minutes,
            use_browser_notification=reminder.use_browser_notification,
            notification_sound=reminder.notification_sound,
            is_enabled=reminder.is_enabled,
            created_at=reminder.created_at,
            updated_at=reminder.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating reminder: {str(e)}")


@router.delete("/{reminder_id}")
async def delete_reminder(
    user_id: str,
    reminder_id: int,
    session: Session = Depends(get_session)
):
    """Delete a reminder."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        statement = select(EyeHealthReminder).where(
            EyeHealthReminder.id == reminder_id,
            EyeHealthReminder.user_id == user_id
        )
        reminder = session.exec(statement).first()
        
        if not reminder:
            raise HTTPException(status_code=404, detail="Reminder not found")
        
        session.delete(reminder)
        session.commit()
        
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting reminder: {str(e)}")
