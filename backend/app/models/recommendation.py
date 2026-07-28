from datetime import datetime
from typing import Optional
from sqlalchemy import ForeignKey, Float, String, Text, DateTime, func, UniqueConstraint, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"
    __table_args__ = (UniqueConstraint('student_id', 'job_id', name='uq_student_job_recommendation'),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"))
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.id"))
    
    fit_score: Mapped[float] = mapped_column(Float) # 0-100
    fit_band: Mapped[str] = mapped_column(String(20)) # Excellent, Good, Fair, Low
    
    matched_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    missing_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    
    reason_summary: Mapped[Optional[str]] = mapped_column(Text)
    score_breakdown: Mapped[dict] = mapped_column(JSON, default=dict)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="recommendations")
    job = relationship("Job", back_populates="recommendations")
