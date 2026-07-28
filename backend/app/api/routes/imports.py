from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.models.user import User
from app.models.import_record import ImportRecord
from app.schemas.import_record import ImportPreview, ImportRecordResponse
from app.services.excel_import_service import ExcelImportService
import json

router = APIRouter()

@router.post("/preview", response_model=ImportPreview)
async def preview_import(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Preview Excel data before importing (Admin only)."""
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only Excel files are supported")
        
    content = await file.read()
    try:
        preview = ExcelImportService.parse_and_validate(content, file.filename)
        return preview
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/confirm")
async def confirm_import(
    preview_data: ImportPreview,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Confirm and run import from preview data (Admin only)."""
    
    success, error, errors = await ExcelImportService.import_data(db, [r.dict() for r in preview_data.preview_data])
    
    # Save record
    status = "Success"
    if error > 0 and success > 0:
        status = "Partial"
    elif success == 0:
        status = "Failed"
        
    record = ImportRecord(
        filename=preview_data.filename,
        status=status,
        total_rows=preview_data.total_rows,
        success_rows=success,
        error_rows=error,
        errors=errors,
        imported_by=current_user.id
    )
    db.add(record)
    await db.commit()
    
    return {"message": "Import completed", "success": success, "errors": error}

@router.get("/", response_model=List[ImportRecordResponse])
async def read_imports(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Get import history (Admin only)."""
    result = await db.execute(
        select(ImportRecord).order_by(ImportRecord.created_at.desc()).offset(skip).limit(limit)
    )
    return result.scalars().all()
