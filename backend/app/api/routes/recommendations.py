from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.models.recommendation import Recommendation
from app.models.user import User
from app.models.student import Student
from app.schemas.recommendation import RecommendationResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter()

@router.get("/me", response_model=List[RecommendationResponse])
async def read_my_recommendations(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 10,
) -> Any:
    """Retrieve recommendations for current student."""
    
    # Get student id
    result = await db.execute(select(Student).where(Student.user_id == current_user.id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    result = await db.execute(
        select(Recommendation)
        .options(selectinload(Recommendation.job))
        .where(Recommendation.student_id == student.id)
        .order_by(Recommendation.fit_score.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.post("/generate/{student_id}")
async def generate_recommendations(
    student_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Generate recommendations for a student (Admin only)."""
    
    # Can be run in background, but we'll await it for demo purposes to see immediate results
    num_generated = await RecommendationService.generate_recommendations_for_student(db, student_id)
    
    return {"message": f"Generated {num_generated} recommendations for student {student_id}"}
