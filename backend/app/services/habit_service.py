"""Service for managing habit tracking and analytics."""
from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import List
from app.models import HabitLog
from app.schemas import HabitLogCreate, HabitWeeklySummary
import statistics


class HabitService:
    """Service for habit tracking operations."""
    
    @staticmethod
    def create_habit_log(
        session: Session,
        user_id: str,
        habit_log: HabitLogCreate
    ) -> HabitLog:
        """Create a new habit log entry."""
        db_log = HabitLog(
            user_id=user_id,
            screen_time_hours=habit_log.screen_time_hours,
            breaks_taken=habit_log.breaks_taken,
            break_duration_minutes=habit_log.break_duration_minutes,
            lighting_quality=habit_log.lighting_quality,
            eye_strain_level=habit_log.eye_strain_level,
            notes=habit_log.notes,
        )
        session.add(db_log)
        session.commit()
        session.refresh(db_log)
        return db_log
    
    @staticmethod
    def get_user_habit_logs(
        session: Session,
        user_id: str,
        days: int = 30
    ) -> List[HabitLog]:
        """Get user's habit logs for the past N days."""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        statement = select(HabitLog).where(
            HabitLog.user_id == user_id,
            HabitLog.date >= cutoff_date
        ).order_by(HabitLog.date.desc())
        return session.exec(statement).all()
    
    @staticmethod
    def get_weekly_summary(
        session: Session,
        user_id: str
    ) -> HabitWeeklySummary:
        """Generate weekly habit summary."""
        week_start = datetime.utcnow() - timedelta(days=7)
        week_end = datetime.utcnow()
        
        statement = select(HabitLog).where(
            HabitLog.user_id == user_id,
            HabitLog.date >= week_start,
            HabitLog.date <= week_end
        )
        logs = session.exec(statement).all()
        
        if not logs:
            return HabitWeeklySummary(
                week_start=week_start,
                week_end=week_end,
                avg_screen_time=0,
                avg_strain_level=0,
                total_breaks=0,
                habit_score=0,
                summary="No habit data recorded this week.",
                recommendations=["Start tracking your daily eye habits"]
            )
        
        # Calculate averages
        screen_times = [log.screen_time_hours for log in logs]
        strain_levels = [log.eye_strain_level for log in logs]
        
        avg_screen_time = statistics.mean(screen_times)
        avg_strain = statistics.mean(strain_levels)
        total_breaks = sum(log.breaks_taken for log in logs)
        
        # Calculate habit score (0-100)
        habit_score = HabitService._calculate_habit_score(
            avg_screen_time,
            avg_strain,
            total_breaks,
            len(logs)
        )
        
        # Generate recommendations
        recommendations = HabitService._generate_recommendations(
            avg_screen_time,
            avg_strain,
            total_breaks,
            len(logs)
        )
        
        summary = (
            f"This week you averaged {avg_screen_time:.1f} hours of screen time daily. "
            f"Your average eye strain level was {avg_strain:.1f}/10, and you took {total_breaks} breaks total. "
            f"Your weekly habit score is {habit_score}/100."
        )
        
        return HabitWeeklySummary(
            week_start=week_start,
            week_end=week_end,
            avg_screen_time=avg_screen_time,
            avg_strain_level=avg_strain,
            total_breaks=total_breaks,
            habit_score=habit_score,
            summary=summary,
            recommendations=recommendations
        )
    
    @staticmethod
    def _calculate_habit_score(
        screen_time: float,
        strain_level: float,
        breaks: int,
        log_count: int
    ) -> int:
        """Calculate habit score based on metrics."""
        score = 100
        
        # Penalize excessive screen time (>8 hours is bad)
        if screen_time > 8:
            score -= min(30, (screen_time - 8) * 5)
        
        # Penalize high strain levels
        if strain_level > 6:
            score -= (strain_level - 6) * 5
        
        # Reward adequate breaks
        expected_breaks = log_count * 2  # Expect at least 2 breaks per day
        if breaks < expected_breaks:
            score -= min(20, (expected_breaks - breaks) * 2)
        
        return max(0, min(100, score))
    
    @staticmethod
    def _generate_recommendations(
        screen_time: float,
        strain_level: float,
        breaks: int,
        log_count: int
    ) -> List[str]:
        """Generate personalized recommendations."""
        recommendations = []
        
        if screen_time > 8:
            recommendations.append("Try to reduce screen time. Consider taking more frequent breaks.")
        
        if strain_level > 7:
            recommendations.append("Your eye strain is high. Ensure proper lighting and take the 20-20-20 breaks.")
        
        if breaks < log_count * 1.5:
            recommendations.append("You're not taking enough breaks. Aim for at least 2-3 breaks per day.")
        
        if len(recommendations) == 0:
            recommendations.append("Great work! Keep maintaining your healthy eye habits.")
        
        return recommendations
