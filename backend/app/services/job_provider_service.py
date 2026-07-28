import json
import os
from typing import List, Optional
from app.schemas.job import JobFilters, JobBase

class JobProviderBase:
    async def fetch_jobs(self, filters: JobFilters) -> List[JobBase]:
        raise NotImplementedError
    
    async def get_job(self, external_id: str) -> Optional[JobBase]:
        raise NotImplementedError

class MockJobProvider(JobProviderBase):
    async def fetch_jobs(self, filters: JobFilters) -> List[JobBase]:
        # Return hardcoded mock jobs
        return [
            JobBase(
                external_id="mock-1",
                title="Frontend Developer",
                company="TechCorp",
                description="We are looking for a React expert...",
                location="Bangalore",
                salary_min=10.0,
                salary_max=15.0,
                work_mode="Hybrid",
                skills_required=["React", "TypeScript", "Tailwind CSS"],
                experience_min=2.0,
                experience_max=5.0,
                job_type="Full-time",
                source="mock"
            )
        ]
        
    async def get_job(self, external_id: str) -> Optional[JobBase]:
        jobs = await self.fetch_jobs(JobFilters())
        for job in jobs:
            if job.external_id == external_id:
                return job
        return None

class SeededJsonJobProvider(JobProviderBase):
    def __init__(self):
        self.file_path = os.path.join(os.path.dirname(__file__), "..", "..", "sample_data", "jobs.json")
        
    async def fetch_jobs(self, filters: JobFilters) -> List[JobBase]:
        if not os.path.exists(self.file_path):
            return []
            
        with open(self.file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        jobs = [JobBase(**item, source="seeded") for item in data]
        
        # Apply basic filters
        if filters.search:
            s = filters.search.lower()
            jobs = [j for j in jobs if s in j.title.lower() or s in j.company.lower()]
            
        if filters.location:
            jobs = [j for j in jobs if j.location and filters.location.lower() in j.location.lower()]
            
        return jobs

class HimalayasApiProvider(JobProviderBase):
    async def fetch_jobs(self, filters: JobFilters) -> List[JobBase]:
        # Minimal implementation for the free API
        # Using httpx to call https://himalayas.app/jobs/api
        import httpx
        
        url = "https://himalayas.app/jobs/api"
        # We can pass limit etc
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params={"limit": 50})
                if response.status_code == 200:
                    data = response.json()
                    jobs = []
                    for item in data.get("jobs", []):
                        jobs.append(JobBase(
                            external_id=str(item.get("id")),
                            title=item.get("title"),
                            company=item.get("companyName"),
                            description=item.get("description", "")[:500], # truncated
                            location=item.get("locationRestrictions", ["Remote"])[0] if item.get("locationRestrictions") else "Remote",
                            work_mode="Remote",
                            source="himalayas",
                            source_url=item.get("applicationLink") or item.get("url")
                        ))
                    return jobs
            except Exception as e:
                print(f"Error fetching from Himalayas: {e}")
        return []

def get_job_provider(provider_name: str) -> JobProviderBase:
    if provider_name == "himalayas":
        return HimalayasApiProvider()
    elif provider_name == "mock":
        return MockJobProvider()
    else:
        return SeededJsonJobProvider()
