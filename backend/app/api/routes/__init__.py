from fastapi import APIRouter
from app.api.routes import auth, students, jobs, recommendations, imports, applications, analytics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(imports.router, prefix="/imports", tags=["imports"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
