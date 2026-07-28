from pydantic import BaseModel
from typing import List, Dict, Any

class DashboardStats(BaseModel):
    total_students: int
    total_jobs: int
    recommendations_generated: int
    recent_imports: int

class ChartData(BaseModel):
    name: str
    value: int | float
    fill: str | None = None

class DashboardAnalyticsResponse(BaseModel):
    stats: DashboardStats
    skills_distribution: List[ChartData]
    match_quality: List[ChartData]
    applications_status: List[ChartData]
