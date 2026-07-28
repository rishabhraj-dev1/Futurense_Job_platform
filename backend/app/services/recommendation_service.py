from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.student import Student
from app.models.job import Job
from app.models.recommendation import Recommendation
from app.services.scoring_engine import ScoringEngine
from app.services.student_profile_service import StudentProfileService
import logging

logger = logging.getLogger(__name__)

class RecommendationService:
    @staticmethod
    async def generate_recommendations_for_student(db: AsyncSession, student_id: int):
        # 1. Get student with relations
        student = await db.execute(
            select(Student)
            .options(selectinload(Student.preferences), selectinload(Student.skills))
            .where(Student.id == student_id)
        )
        student = student.scalar_one_or_none()
        if not student:
            logger.error(f"Student {student_id} not found")
            return

        # 2. Get active jobs
        jobs_result = await db.execute(select(Job).where(Job.is_active == True))
        jobs = jobs_result.scalars().all()
        
        if not jobs:
            return
            
        # 3. Score and create recommendations
        # First, clear old ones (simple approach for now)
        await db.execute(
            Recommendation.__table__.delete().where(Recommendation.student_id == student_id)
        )
        
        recommendations = []
        for job in jobs:
            score, band, matched, missing, summary, breakdown = ScoringEngine.calculate_score(student, job)
            
            # Only save if score > 30 to save space
            if score >= 30:
                rec = Recommendation(
                    student_id=student.id,
                    job_id=job.id,
                    fit_score=score,
                    fit_band=band,
                    matched_skills=matched,
                    missing_skills=missing,
                    reason_summary=summary,
                    score_breakdown=breakdown
                )
                recommendations.append(rec)
                
        if recommendations:
            db.add_all(recommendations)
            await db.commit()
            
        return len(recommendations)
