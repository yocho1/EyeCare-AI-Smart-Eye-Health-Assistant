"""Learning module endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.db.session import get_session
from app.schemas import (
    LearningModule,
    QuizSubmission,
    QuizResult,
    LearningProgressResponse
)
from app.services.learning_service import LearningService
from app.models import LearningProgress
from datetime import datetime

router = APIRouter(prefix="/api/learning", tags=["Learning"])


@router.get("/modules", response_model=List[LearningModule])
async def get_all_modules():
    """Get all available learning modules."""
    try:
        modules = LearningService.get_all_modules()
        return modules
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching modules: {str(e)}")


@router.get("/modules/{module_id}", response_model=LearningModule)
async def get_module(module_id: str):
    """Get a specific learning module by ID."""
    try:
        module = LearningService.get_module(module_id)
        return module
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching module: {str(e)}")


@router.post("/modules/{module_id}/quiz", response_model=QuizResult)
async def submit_quiz(
    user_id: str,
    module_id: str,
    submission: QuizSubmission,
    session: Session = Depends(get_session)
) -> QuizResult:
    """
    Submit quiz answers for a learning module.
    
    Returns score and feedback.
    """
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        # Check quiz
        result = LearningService.check_quiz(module_id, submission.answers)
        
        # Save progress
        module = LearningService.get_module(module_id)
        progress = LearningProgress(
            user_id=user_id,
            module_id=module_id,
            module_title=module.title,
            completed=result.passed,
            quiz_score=result.score,
            completed_at=datetime.utcnow() if result.passed else None
        )
        session.add(progress)
        session.commit()
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting quiz: {str(e)}")


@router.get("/progress", response_model=List[LearningProgressResponse])
async def get_learning_progress(
    user_id: str,
    session: Session = Depends(get_session)
) -> List[LearningProgressResponse]:
    """Get user's learning progress."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        statement = select(LearningProgress).where(
            LearningProgress.user_id == user_id
        ).order_by(LearningProgress.created_at.desc())
        
        progress_records = session.exec(statement).all()
        
        return [
            LearningProgressResponse(
                module_id=p.module_id,
                module_title=p.module_title,
                completed=p.completed,
                quiz_score=p.quiz_score,
                created_at=p.created_at,
                completed_at=p.completed_at
            )
            for p in progress_records
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching progress: {str(e)}")


@router.get("/progress/{module_id}", response_model=LearningProgressResponse)
async def get_module_progress(
    user_id: str,
    module_id: str,
    session: Session = Depends(get_session)
) -> LearningProgressResponse:
    """Get progress for a specific module."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        statement = select(LearningProgress).where(
            LearningProgress.user_id == user_id,
            LearningProgress.module_id == module_id
        )
        
        progress = session.exec(statement).first()
        
        if not progress:
            raise HTTPException(status_code=404, detail="Progress not found")
        
        return LearningProgressResponse(
            module_id=progress.module_id,
            module_title=progress.module_title,
            completed=progress.completed,
            quiz_score=progress.quiz_score,
            created_at=progress.created_at,
            completed_at=progress.completed_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching progress: {str(e)}")
