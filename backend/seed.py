import asyncio
import os
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import async_session_maker, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.student_preference import StudentPreference
from app.models.skill import StudentSkill
from app.models.job import Job
from app.models.recommendation import Recommendation

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def seed_data():
    async with async_session_maker() as db:
        # 1. Create Admin
        result = await db.execute(select(User).where(User.email == "admin@skillmatch.com"))
        admin_user = result.scalar_one_or_none()
        if not admin_user:
            admin_user = User(
                email="admin@skillmatch.com",
                hashed_password=get_password_hash("admin123"),
                full_name="System Admin",
                role=UserRole.ADMIN
            )
            db.add(admin_user)
            await db.flush()

        # 2. Create Demo Student (Alice Smith)
        result = await db.execute(select(User).where(User.email == "alice@example.com"))
        student_user = result.scalar_one_or_none()
        if not student_user:
            student_user = User(
                email="alice@example.com",
                hashed_password=get_password_hash("password123"),
                full_name="Alice Smith",
                role=UserRole.STUDENT
            )
            db.add(student_user)
            await db.flush()

            # Create Student Profile
            student_profile = Student(
                user_id=student_user.id,
                phone="9876543210",
                current_company="TechSoft",
                current_role="Frontend Developer",
                current_ctc=12.0,
                expected_ctc=18.0,
                notice_period=30,
                work_mode="Hybrid",
                willing_to_relocate=True,
                profile_completeness=85
            )
            db.add(student_profile)
            await db.flush()

            # Add Preferences
            pref = StudentPreference(
                student_id=student_profile.id,
                preferred_roles=["Senior Frontend Engineer", "React Developer"],
                preferred_locations=["Bangalore", "Remote"]
            )
            db.add(pref)

            # Add Skills
            skills = [
                StudentSkill(student_id=student_profile.id, skill_name="React", category="Frontend", proficiency="Advanced"),
                StudentSkill(student_id=student_profile.id, skill_name="TypeScript", category="Frontend", proficiency="Intermediate"),
                StudentSkill(student_id=student_profile.id, skill_name="Next.js", category="Frontend", proficiency="Intermediate"),
                StudentSkill(student_id=student_profile.id, skill_name="Python", category="Backend", proficiency="Intermediate"),
                StudentSkill(student_id=student_profile.id, skill_name="FastAPI", category="Backend", proficiency="Intermediate"),
            ]
            db.add_all(skills)

        # 3. Seed Jobs from JSON
        json_path = os.path.join(os.path.dirname(__file__), "sample_data", "jobs.json")
        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                jobs_data = json.load(f)
                
            for job_data in jobs_data:
                result = await db.execute(select(Job).where(Job.external_id == job_data["external_id"]))
                if not result.scalar_one_or_none():
                    job = Job(
                        **job_data,
                        source="seeded"
                    )
                    db.add(job)
        
        await db.commit()
        print("Database seeded successfully with Admin and Alice Student user.")

async def main():
    print("Initializing database...")
    await init_db()
    print("Seeding data...")
    await seed_data()

if __name__ == "__main__":
    asyncio.run(main())
