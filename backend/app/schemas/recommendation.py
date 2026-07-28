from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.job import JobResponse

class RecommendationBase(BaseModel):
    student_id: int
    job_id: int
    fit_score: float
    fit_band: str
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    reason_summary: Optional[str] = None
    score_breakdown: Dict[str, Any] = {}

class RecommendationCreate(RecommendationBase):
    pass

class RecommendationResponse(RecommendationBase):
    id: int
    created_at: datetime
    job: Optional[JobResponse] = None

    model_config = {"from_attributes": True}
