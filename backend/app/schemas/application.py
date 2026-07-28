from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.application import ApplicationStatus
from app.schemas.job import JobResponse
from app.schemas.student import StudentResponse

class ApplicationBase(BaseModel):
    job_id: int
    status: ApplicationStatus = ApplicationStatus.INTERESTED
    notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    student_id: int

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    notes: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: int
    student_id: int
    applied_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    job: Optional[JobResponse] = None
    student: Optional[StudentResponse] = None

    model_config = {"from_attributes": True}
