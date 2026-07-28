from typing import List, Dict, Any
from app.models.student import Student
from app.models.job import Job
from app.services.llm_provider_base import LLMProviderBase
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class OpenAIProvider(LLMProviderBase):
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set.")
        # self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
    async def rank_jobs(self, student: Student, jobs: List[Job]) -> List[Dict[str, Any]]:
        # Stub for future implementation
        logger.warning("OpenAI rank_jobs called but not fully implemented.")
        return []

    async def explain_match(self, student: Student, job: Job) -> str:
        # Stub
        return "OpenAI explanation stub"

    async def extract_skills(self, text: str) -> List[str]:
        # Stub
        return []

def get_llm_provider() -> LLMProviderBase:
    if settings.LLM_PROVIDER == "openai":
        try:
            return OpenAIProvider()
        except ValueError:
            logger.warning("OpenAI not configured properly, falling back to mock.")
            from app.services.llm_provider_mock import MockLLMProvider
            return MockLLMProvider()
    else:
        from app.services.llm_provider_mock import MockLLMProvider
        return MockLLMProvider()
