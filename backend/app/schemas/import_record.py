from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.user import UserResponse

class ImportRecordBase(BaseModel):
    filename: str
    status: str

class ImportRecordCreate(ImportRecordBase):
    imported_by: Optional[int] = None
    total_rows: int = 0
    success_rows: int = 0
    error_rows: int = 0
    errors: List[Dict[str, Any]] = []

class ImportRecordResponse(ImportRecordBase):
    id: int
    total_rows: int
    success_rows: int
    error_rows: int
    errors: List[Dict[str, Any]]
    created_at: datetime
    imported_by: Optional[int] = None
    user: Optional[UserResponse] = None

    model_config = {"from_attributes": True}

class ImportPreviewRow(BaseModel):
    row_num: int
    data: Dict[str, Any]
    is_valid: bool
    errors: List[str] = []

class ImportPreview(BaseModel):
    filename: str
    total_rows: int
    valid_rows: int
    invalid_rows: int
    preview_data: List[ImportPreviewRow]
