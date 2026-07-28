from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
    name: Optional[str] = None
