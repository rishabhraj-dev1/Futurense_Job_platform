from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.student import Student
from app.models.user import User

class StudentProfileService:
    @staticmethod
    async def calculate_completeness(student: Student) -> int:
        score = 0
        total_fields = 12
        
        # 1. Phone
        if student.phone: score += 1
        # 2. Bio
        if student.bio: score += 1
        # 3. Resume
        if student.resume_url: score += 1
        # 4. LinkedIn
        if student.linkedin_url: score += 1
        # 5. Current info
        if student.current_company and student.current_role: score += 1
        # 6. Expected CTC
        if student.expected_ctc: score += 1
        # 7. Notice Period
        if student.notice_period is not None: score += 1
        # 8. Work Mode
        if student.work_mode: score += 1
        
        # 9. Preferences (Roles)
        if student.preferences and student.preferences.preferred_roles: score += 1
        # 10. Preferences (Locations)
        if student.preferences and student.preferences.preferred_locations: score += 1
        
        # 11. Skills
        if student.skills and len(student.skills) >= 3: score += 1
        
        # 12. User details
        if student.user and student.user.full_name: score += 1
        
        return int((score / total_fields) * 100)

    @staticmethod
    async def get_student_by_user_id(db: AsyncSession, user_id: int) -> Student | None:
        result = await db.execute(
            select(Student)
            .options(
                selectinload(Student.user),
                selectinload(Student.preferences),
                selectinload(Student.skills)
            )
            .where(Student.user_id == user_id)
        )
        return result.scalar_one_or_none()
