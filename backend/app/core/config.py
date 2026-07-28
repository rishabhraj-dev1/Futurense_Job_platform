from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillMatch Pro"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./skillmatch.db"
    
    # Providers
    JOB_PROVIDER: str = "seeded" # mock, seeded, himalayas
    LLM_PROVIDER: str = "mock" # mock, openai
    OPENAI_API_KEY: str | None = None
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
