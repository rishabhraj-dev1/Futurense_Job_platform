from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class JobBase(BaseModel):
    external_id: Optional[str] = None
    title: str
    company: str
    description: str
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    currency: Optional[str] = "INR"
    work_mode: Optional[str] = None
    skills_required: List[str] = []
    experience_min: Optional[float] = None
    experience_max: Optional[float] = None
    job_type: Optional[str] = None
    source: str
    source_url: Optional[str] = None

class JobCreate(JobBase):
    posted_at: Optional[datetime] = None

class JobResponse(JobBase):
    id: int
    posted_at: Optional[datetime] = None
    created_at: datetime
    is_active: bool

    model_config = {"from_attributes": True}

class JobListResponse(BaseModel):
    items: List[JobResponse]
    total: int

class JobFilters(BaseModel):
    search: Optional[str] = None
    location: Optional[str] = None
    work_mode: Optional[str] = None
    job_type: Optional[str] = None
