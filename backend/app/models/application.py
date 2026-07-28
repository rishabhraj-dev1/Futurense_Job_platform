import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import ForeignKey, Enum, DateTime, func, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class ApplicationStatus(str, enum.Enum):
    INTERESTED = "interested"
    APPLIED = "applied"
    INTERVIEWING = "interviewing"
    OFFER = "offer"
    REJECTED = "rejected"

class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint('student_id', 'job_id', name='uq_student_job_application'),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"))
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.id"))
    
    status: Mapped[ApplicationStatus] = mapped_column(Enum(ApplicationStatus), default=ApplicationStatus.INTERESTED)
    notes: Mapped[Optional[str]] = mapped_column(Text)
    
    applied_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("Student", back_populates="applications")
    job = relationship("Job", back_populates="applications")
