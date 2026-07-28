from typing import List, Dict, Any
from app.models.student import Student
from app.models.job import Job
from app.services.llm_provider_base import LLMProviderBase
import asyncio

class MockLLMProvider(LLMProviderBase):
    async def rank_jobs(self, student: Student, jobs: List[Job]) -> List[Dict[str, Any]]:
        # Simply returns them in original order with a mock explanation
        await asyncio.sleep(0.5) # Simulate network call
        ranked = []
        for job in jobs:
            ranked.append({
                "job_id": job.id,
                "llm_score": 85.0,
                "explanation": f"Based on {student.user.full_name}'s profile, {job.title} at {job.company} is a solid match due to overlapping skills."
            })
        return ranked

    async def explain_match(self, student: Student, job: Job) -> str:
        await asyncio.sleep(0.5)
        return f"This {job.title} role aligns well with your current trajectory as a {student.current_role}."

    async def extract_skills(self, text: str) -> List[str]:
        # Return dummy extracted skills
        return ["Python", "Communication", "Problem Solving"]
