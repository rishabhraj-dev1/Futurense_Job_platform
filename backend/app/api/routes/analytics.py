from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.api import deps
from app.models.user import User
from app.models.student import Student
from app.models.job import Job
from app.models.recommendation import Recommendation
from app.models.import_record import ImportRecord
from app.schemas.analytics import DashboardAnalyticsResponse

router = APIRouter()

@router.get("/", response_model=DashboardAnalyticsResponse)
async def get_dashboard_analytics(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Get overall analytics for admin dashboard."""
    
    # Simple counts
    students_count = await db.execute(select(func.count(Student.id)))
    jobs_count = await db.execute(select(func.count(Job.id)))
    recs_count = await db.execute(select(func.count(Recommendation.id)))
    imports_count = await db.execute(select(func.count(ImportRecord.id)))
    
    stats = {
        "total_students": students_count.scalar() or 0,
        "total_jobs": jobs_count.scalar() or 0,
        "recommendations_generated": recs_count.scalar() or 0,
        "recent_imports": imports_count.scalar() or 0
    }
    
    # Mocked charts data for MVP
    skills_dist = [
        {"name": "React", "value": 45},
        {"name": "Python", "value": 60},
        {"name": "Node.js", "value": 30},
        {"name": "AWS", "value": 20},
        {"name": "SQL", "value": 75}
    ]
    
    match_quality = [
        {"name": "Excellent", "value": 15},
        {"name": "Good", "value": 40},
        {"name": "Fair", "value": 35},
        {"name": "Low", "value": 10}
    ]
    
    apps_status = [
        {"name": "Interested", "value": 120},
        {"name": "Applied", "value": 85},
        {"name": "Interviewing", "value": 30},
        {"name": "Offer", "value": 12}
    ]
    
    return {
        "stats": stats,
        "skills_distribution": skills_dist,
        "match_quality": match_quality,
        "applications_status": apps_status
    }
