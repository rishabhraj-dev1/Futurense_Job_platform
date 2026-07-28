from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, Text, DateTime, Boolean, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    external_id: Mapped[Optional[str]] = mapped_column(String(255), index=True) # ID from provider
    
    title: Mapped[str] = mapped_column(String(255), index=True)
    company: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str] = mapped_column(Text)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    
    salary_min: Mapped[Optional[float]] = mapped_column(Float)
    salary_max: Mapped[Optional[float]] = mapped_column(Float)
    currency: Mapped[Optional[str]] = mapped_column(String(10), default="INR")
    
    work_mode: Mapped[Optional[str]] = mapped_column(String(50)) # Remote, On-site, Hybrid
    skills_required: Mapped[list[str]] = mapped_column(JSON, default=list)
    
    experience_min: Mapped[Optional[float]] = mapped_column(Float)
    experience_max: Mapped[Optional[float]] = mapped_column(Float)
    
    job_type: Mapped[Optional[str]] = mapped_column(String(50)) # Full-time, Contract, Internship
    source: Mapped[str] = mapped_column(String(50)) # e.g., "seeded", "himalayas", "mock"
    source_url: Mapped[Optional[str]] = mapped_column(String(1024))
    
    posted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    recommendations = relationship("Recommendation", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    saved_by_students = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")
