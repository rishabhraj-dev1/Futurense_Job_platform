from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from app.schemas.user import UserResponse

class SkillBase(BaseModel):
    skill_name: str
    category: str
    proficiency: str

class SkillResponse(SkillBase):
    id: int
    model_config = {"from_attributes": True}

class PreferenceBase(BaseModel):
    preferred_roles: List[str] = []
    preferred_locations: List[str] = []

class PreferenceResponse(PreferenceBase):
    id: int
    model_config = {"from_attributes": True}

class StudentBase(BaseModel):
    phone: Optional[str] = None
    current_company: Optional[str] = None
    current_role: Optional[str] = None
    current_ctc: Optional[float] = None
    expected_ctc: Optional[float] = None
    notice_period: Optional[int] = None
    work_mode: Optional[str] = None
    willing_to_relocate: bool = False
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    bio: Optional[str] = None

class StudentCreate(StudentBase):
    user_id: int

class StudentUpdate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int
    user_id: int
    profile_completeness: int
    user: Optional[UserResponse] = None
    
    model_config = {"from_attributes": True}

class StudentDetailResponse(StudentResponse):
    preferences: Optional[PreferenceResponse] = None
    skills: List[SkillResponse] = []
