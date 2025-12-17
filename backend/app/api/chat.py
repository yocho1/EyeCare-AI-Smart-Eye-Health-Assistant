"""Chat and AI interaction endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Optional, Dict, Any
from datetime import datetime
from app.db.session import get_session
from app.schemas import ChatMessage as ChatMessageSchema, AIResponse, ChatHistory
from app.services.ai_service import get_ai_service
from app.models import ChatMessage

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("/message", response_model=AIResponse)
async def send_message(
    user_id: str,
    message: ChatMessageSchema,
    session: Session = Depends(get_session)
) -> AIResponse:
    """
    Send a message to the AI assistant.
    
    Returns AI response with tips and recommendations.
    """
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    if not message.user_message or not message.user_message.strip():
        raise HTTPException(status_code=400, detail="Message content is required")
    
    try:
        # Get AI service and generate response
        ai_service = get_ai_service()
        context = message.context or {}
        context["time_of_day"] = datetime.now().strftime("%H:%M")
        
        ai_response = await ai_service.chat(message.user_message, context)
        
        # Store chat history
        chat_log = ChatMessage(
            user_id=user_id,
            user_message=message.user_message,
            ai_response=ai_response.model_dump_json(),
            message_type=context.get("message_type", "general")
        )
        session.add(chat_log)
        session.commit()
        
        return ai_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")


@router.get("/history", response_model=list[ChatHistory])
async def get_chat_history(
    user_id: str,
    limit: int = 20,
    session: Session = Depends(get_session)
) -> list[ChatHistory]:
    """
    Get user's chat history.
    
    Returns last N chat messages.
    """
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    from sqlmodel import select
    
    statement = select(ChatMessage).where(
        ChatMessage.user_id == user_id
    ).order_by(ChatMessage.created_at.desc()).limit(limit)
    
    messages = session.exec(statement).all()
    
    return [
        ChatHistory(
            id=msg.id,
            user_message=msg.user_message,
            ai_response=msg.ai_response,
            message_type=msg.message_type,
            created_at=msg.created_at
        )
        for msg in messages
    ]


@router.delete("/history/{message_id}")
async def delete_chat_message(
    user_id: str,
    message_id: int,
    session: Session = Depends(get_session)
):
    """Delete a specific chat message."""
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    from sqlmodel import select
    
    statement = select(ChatMessage).where(
        ChatMessage.id == message_id,
        ChatMessage.user_id == user_id
    )
    message = session.exec(statement).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    session.delete(message)
    session.commit()
    
    return {"status": "deleted"}
