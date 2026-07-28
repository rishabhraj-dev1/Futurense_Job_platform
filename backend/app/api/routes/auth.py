from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.core.config import settings
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User, UserRole
from app.models.student import Student
from app.schemas.auth import TokenResponse
from app.schemas.user import UserResponse, UserCreate

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login_access_token(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> any:
    """OAuth2 compatible token login, get an access token for future requests."""
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "name": user.full_name
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(deps.get_current_user),
) -> any:
    """Get current user."""
    return current_user
