from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class StudentPreference(Base):
    __tablename__ = "student_preferences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), unique=True)
    
    preferred_roles: Mapped[list[str]] = mapped_column(JSON, default=list)
    preferred_locations: Mapped[list[str]] = mapped_column(JSON, default=list)

    student = relationship("Student", back_populates="preferences")
