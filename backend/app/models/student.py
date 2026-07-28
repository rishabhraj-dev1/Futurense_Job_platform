from typing import Optional, List
from sqlalchemy import String, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    current_company: Mapped[Optional[str]] = mapped_column(String(255))
    current_role: Mapped[Optional[str]] = mapped_column(String(255))
    current_ctc: Mapped[Optional[float]] = mapped_column(Float) # In lakhs per annum, e.g.
    expected_ctc: Mapped[Optional[float]] = mapped_column(Float)
    notice_period: Mapped[Optional[int]] = mapped_column(Integer) # In days
    work_mode: Mapped[Optional[str]] = mapped_column(String(50)) # Remote, On-site, Hybrid
    willing_to_relocate: Mapped[bool] = mapped_column(default=False)
    
    resume_url: Mapped[Optional[str]] = mapped_column(String(1024))
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(1024))
    github_url: Mapped[Optional[str]] = mapped_column(String(1024))
    portfolio_url: Mapped[Optional[str]] = mapped_column(String(1024))
    
    bio: Mapped[Optional[str]] = mapped_column(Text)
    profile_completeness: Mapped[int] = mapped_column(default=0) # 0-100%

    user = relationship("User", back_populates="student")
    preferences = relationship("StudentPreference", back_populates="student", uselist=False)
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="student", cascade="all, delete-orphan")
