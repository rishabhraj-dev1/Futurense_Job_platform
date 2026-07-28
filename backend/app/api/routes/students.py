from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.models.student import Student
from app.models.user import User
from app.schemas.student import StudentResponse, StudentDetailResponse, StudentUpdate

router = APIRouter()

@router.get("/", response_model=List[StudentResponse])
async def read_students(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Retrieve students (Admin only)."""
    result = await db.execute(
        select(Student).options(selectinload(Student.user)).offset(skip).limit(limit)
    )
    return result.scalars().all()

@router.get("/me", response_model=StudentDetailResponse)
async def read_student_me(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get current student profile."""
    result = await db.execute(
        select(Student)
        .options(
            selectinload(Student.user),
            selectinload(Student.preferences),
            selectinload(Student.skills)
        )
        .where(Student.user_id == current_user.id)
    )
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student

@router.get("/{student_id}", response_model=StudentDetailResponse)
async def read_student_by_id(
    student_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get student profile by ID."""
    result = await db.execute(
        select(Student)
        .options(
            selectinload(Student.user),
            selectinload(Student.preferences),
            selectinload(Student.skills)
        )
        .where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    # Only admin or the student themselves can view the full profile
    if current_user.role != "admin" and student.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return student
