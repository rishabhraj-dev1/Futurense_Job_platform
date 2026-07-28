from typing import List, Dict, Any
from app.models.student import Student
from app.models.job import Job

class LLMProviderBase:
    async def rank_jobs(self, student: Student, jobs: List[Job]) -> List[Dict[str, Any]]:
        """Ranks jobs for a student using LLM reasoning."""
        raise NotImplementedError

    async def explain_match(self, student: Student, job: Job) -> str:
        """Generates a personalized explanation of why a job is a good fit."""
        raise NotImplementedError

    async def extract_skills(self, text: str) -> List[str]:
        """Extracts technical skills from text (e.g. resume or job description)."""
        raise NotImplementedError
