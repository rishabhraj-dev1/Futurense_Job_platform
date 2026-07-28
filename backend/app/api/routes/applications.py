from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.models.application import Application
from app.models.student import Student
from app.models.user import User
from app.schemas.application import ApplicationResponse, ApplicationCreate, ApplicationUpdate

router = APIRouter()

@router.get("/me", response_model=List[ApplicationResponse])
async def read_my_applications(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """Retrieve applications for current student."""
    result = await db.execute(select(Student).where(Student.user_id == current_user.id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.job))
        .where(Application.student_id == student.id)
        .order_by(Application.updated_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.post("/", response_model=ApplicationResponse)
async def create_application(
    app_in: ApplicationCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Create a new application/interest."""
    
    # Ensure they apply for themselves
    result = await db.execute(select(Student).where(Student.user_id == current_user.id))
    student = result.scalar_one_or_none()
    if not student or student.id != app_in.student_id:
        raise HTTPException(status_code=403, detail="Not permitted")
        
    # Check if exists
    result = await db.execute(
        select(Application)
        .where(Application.student_id == app_in.student_id)
        .where(Application.job_id == app_in.job_id)
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Already tracked this job")
        
    new_app = Application(
        student_id=app_in.student_id,
        job_id=app_in.job_id,
        status=app_in.status,
        notes=app_in.notes
    )
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)
    return new_app

@router.put("/{app_id}", response_model=ApplicationResponse)
async def update_application(
    app_id: int,
    app_in: ApplicationUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Update application status."""
    result = await db.execute(select(Application).where(Application.id == app_id))
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Verify ownership
    result = await db.execute(select(Student).where(Student.user_id == current_user.id))
    student = result.scalar_one_or_none()
    if not student or student.id != application.student_id:
        raise HTTPException(status_code=403, detail="Not permitted")
        
    if app_in.status is not None:
        application.status = app_in.status
    if app_in.notes is not None:
        application.notes = app_in.notes
        
    await db.commit()
    await db.refresh(application)
    return application
