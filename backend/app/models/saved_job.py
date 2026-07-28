from datetime import datetime
from sqlalchemy import ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class SavedJob(Base):
    __tablename__ = "saved_jobs"
    __table_args__ = (UniqueConstraint('student_id', 'job_id', name='uq_student_job_saved'),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"))
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.id"))
    
    saved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by_students")
