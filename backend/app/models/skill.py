from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class StudentSkill(Base):
    __tablename__ = "student_skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"))
    
    skill_name: Mapped[str] = mapped_column(String(100), index=True)
    category: Mapped[str] = mapped_column(String(50)) # e.g., Frontend, Backend, Tools
    proficiency: Mapped[str] = mapped_column(String(20)) # e.g., Beginner, Intermediate, Advanced

    student = relationship("Student", back_populates="skills")
