from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.models.job import Job
from app.models.user import User
from app.schemas.job import JobResponse, JobListResponse, JobFilters
from app.services.job_provider_service import get_job_provider
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=JobListResponse)
async def read_jobs(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    location: Optional[str] = None,
    work_mode: Optional[str] = None,
    job_type: Optional[str] = None,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve jobs with filters."""
    
    # 1. Fetch from provider (if not mock/seeded, it could hit an API)
    provider = get_job_provider(settings.JOB_PROVIDER)
    filters = JobFilters(search=search, location=location, work_mode=work_mode, job_type=job_type)
    
    # Normally we might sync provider jobs to DB here or just query DB.
    # For MVP, we'll query our DB, assuming jobs are synced/seeded.
    
    query = select(Job).where(Job.is_active == True)
    
    if search:
        query = query.where(Job.title.ilike(f"%{search}%") | Job.company.ilike(f"%{search}%"))
    if location:
        query = query.where(Job.location.ilike(f"%{location}%"))
    if work_mode:
        query = query.where(Job.work_mode.ilike(f"%{work_mode}%"))
        
    # Count total
    total_result = await db.execute(select(Job).where(Job.is_active == True))
    total = len(total_result.scalars().all()) # Simplified count
    
    # Get paginated
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    jobs = result.scalars().all()
    
    return {"items": jobs, "total": total}

@router.get("/{job_id}", response_model=JobResponse)
async def read_job(
    job_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get job by ID."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/sync")
async def sync_jobs(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Sync jobs from configured provider to DB (Admin only)."""
    provider = get_job_provider(settings.JOB_PROVIDER)
    fetched_jobs = await provider.fetch_jobs(JobFilters())
    
    count = 0
    for j in fetched_jobs:
        # Check if exists
        result = await db.execute(select(Job).where(Job.external_id == j.external_id))
        if not result.scalar_one_or_none():
            new_job = Job(
                external_id=j.external_id,
                title=j.title,
                company=j.company,
                description=j.description,
                location=j.location,
                salary_min=j.salary_min,
                salary_max=j.salary_max,
                work_mode=j.work_mode,
                skills_required=j.skills_required,
                experience_min=j.experience_min,
                experience_max=j.experience_max,
                job_type=j.job_type,
                source=j.source,
                source_url=j.source_url
            )
            db.add(new_job)
            count += 1
            
    await db.commit()
    return {"message": f"Successfully synced {count} new jobs from {settings.JOB_PROVIDER}"}
