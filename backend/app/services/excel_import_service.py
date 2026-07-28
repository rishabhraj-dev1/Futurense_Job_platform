import pandas as pd
import io
import re
from typing import List, Dict, Any, Tuple
from app.schemas.import_record import ImportPreview, ImportPreviewRow
from app.models.student import Student
from app.models.user import User, UserRole
from app.models.student_preference import StudentPreference
from app.models.skill import StudentSkill
from app.core.security import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# Column header variations mapping to canonical keys
COLUMN_ALIASES = {
    "Full Name": ["full name", "fullname", "name", "student name", "candidate name", "first name", "applicant name"],
    "Email": ["email", "email id", "email address", "mail", "e-mail", "email_id"],
    "Phone": ["phone", "phone number", "mobile", "mobile number", "contact", "contact number", "phone_number"],
    "Current Company": ["current company", "company", "organization", "employer", "company name"],
    "Current Role": ["current role", "role", "designation", "title", "position", "current designation"],
    "Current CTC": ["current ctc", "current salary", "ctc", "salary", "current_ctc"],
    "Expected CTC": ["expected ctc", "expected salary", "target ctc", "target salary", "expected_ctc"],
    "Notice Period (Days)": ["notice period (days)", "notice period", "notice", "days to join", "notice_period"],
    "Work Mode": ["work mode", "work type", "mode", "location preference", "work_mode"],
    "Willing to Relocate": ["willing to relocate", "relocate", "relocation", "willing_to_relocate"],
    "Preferred Roles": ["preferred roles", "target roles", "desired roles", "role preference", "preferred_roles"],
    "Preferred Locations": ["preferred locations", "target locations", "location preference", "locations", "preferred_locations"],
    "Skills": ["skills", "technical skills", "skill set", "technologies", "key skills", "skill_tree"]
}

def normalize_key(k: str) -> str:
    return re.sub(r'[^a-z0-9]', '', str(k).lower())

def match_canonical_header(df_columns: List[str]) -> Dict[str, str]:
    """Maps canonical keys to the actual matching column name found in the Excel dataframe."""
    mapping = {}
    normalized_cols = {normalize_key(col): col for col in df_columns}
    
    for canonical, aliases in COLUMN_ALIASES.items():
        for alias in aliases:
            norm_alias = normalize_key(alias)
            if norm_alias in normalized_cols:
                mapping[canonical] = normalized_cols[norm_alias]
                break
    return mapping

class ExcelImportService:
    @staticmethod
    def parse_and_validate(file_content: bytes, filename: str) -> ImportPreview:
        try:
            # Load excel or CSV
            if filename.endswith(".csv"):
                df = pd.read_csv(io.BytesIO(file_content))
            else:
                df = pd.read_excel(io.BytesIO(file_content))
                
            df = df.fillna("")
            
            header_map = match_canonical_header(list(df.columns))
            
            # Check mandatory email field
            email_col = header_map.get("Email")
            name_col = header_map.get("Full Name")
            
            if not email_col and not name_col:
                raise ValueError("Excel file must contain at least an 'Email' or 'Full Name' / 'Name' column.")

            preview_rows = []
            valid_count = 0
            invalid_count = 0

            for index, row in df.iterrows():
                row_dict = row.to_dict()
                
                # Normalize values using header_map
                normalized_row = {
                    "Full Name": str(row_dict.get(header_map.get("Full Name", ""), "")).strip() or "Student Candidate",
                    "Email": str(row_dict.get(header_map.get("Email", ""), "")).strip(),
                    "Phone": str(row_dict.get(header_map.get("Phone", ""), "")).strip(),
                    "Current Company": str(row_dict.get(header_map.get("Current Company", ""), "")).strip(),
                    "Current Role": str(row_dict.get(header_map.get("Current Role", ""), "")).strip(),
                    "Current CTC": row_dict.get(header_map.get("Current CTC", ""), 0),
                    "Expected CTC": row_dict.get(header_map.get("Expected CTC", ""), 0),
                    "Notice Period (Days)": row_dict.get(header_map.get("Notice Period (Days)", ""), 0),
                    "Work Mode": str(row_dict.get(header_map.get("Work Mode", ""), "")).strip(),
                    "Willing to Relocate": str(row_dict.get(header_map.get("Willing to Relocate", ""), "")).strip(),
                    "Preferred Roles": str(row_dict.get(header_map.get("Preferred Roles", ""), "")).strip(),
                    "Preferred Locations": str(row_dict.get(header_map.get("Preferred Locations", ""), "")).strip(),
                    "Skills": str(row_dict.get(header_map.get("Skills", ""), "")).strip(),
                }
                
                errors = []
                if not normalized_row["Email"]:
                    # Generate synthetic email if email column is absent
                    clean_name = re.sub(r'[^a-zA-Z0-9]', '', normalized_row["Full Name"].lower())
                    normalized_row["Email"] = f"{clean_name}{index+1}@student.skillmatch.com"
                    
                is_valid = True
                valid_count += 1
                    
                preview_rows.append(
                    ImportPreviewRow(
                        row_num=index + 2, # +2 because 0-indexed and header row
                        data=normalized_row,
                        is_valid=is_valid,
                        errors=errors
                    )
                )

            return ImportPreview(
                filename=filename,
                total_rows=len(df),
                valid_rows=valid_count,
                invalid_rows=invalid_count,
                preview_data=preview_rows
            )
            
        except Exception as e:
            raise ValueError(f"Failed to parse Excel file: {str(e)}")

    @staticmethod
    async def import_data(db: AsyncSession, preview_data: List[Dict[str, Any]]) -> Tuple[int, int, List[dict]]:
        success_count = 0
        error_count = 0
        errors = []

        for row_data in preview_data:
            if not row_data.get('is_valid', True):
                error_count += 1
                errors.append({"row": row_data.get('row_num'), "errors": row_data.get('errors')})
                continue
                
            data = row_data['data']
            email = str(data.get("Email", "")).strip().lower()
            
            try:
                # Check if user exists
                result = await db.execute(select(User).where(User.email == email))
                existing_user = result.scalar_one_or_none()
                
                if existing_user:
                    error_count += 1
                    errors.append({"row": row_data.get('row_num'), "errors": [f"User with email '{email}' already exists"]})
                    continue

                # 1. Create User
                default_password = "password123"
                new_user = User(
                    email=email,
                    hashed_password=get_password_hash(default_password),
                    full_name=str(data.get("Full Name", "Student Candidate")).strip(),
                    role=UserRole.STUDENT,
                    is_active=True
                )
                db.add(new_user)
                await db.flush()

                # 2. Create Student Profile
                willing_to_relocate = str(data.get("Willing to Relocate", "")).strip().lower() in ['yes', 'true', '1', 'y']
                
                def safe_float(val):
                    try:
                        return float(val) if val != "" and val is not None else 0.0
                    except:
                        return 0.0
                        
                def safe_int(val):
                    try:
                        return int(float(val)) if val != "" and val is not None else 0
                    except:
                        return 0

                new_student = Student(
                    user_id=new_user.id,
                    phone=str(data.get("Phone", "")).strip(),
                    current_company=str(data.get("Current Company", "")).strip(),
                    current_role=str(data.get("Current Role", "")).strip(),
                    current_ctc=safe_float(data.get("Current CTC", 0)),
                    expected_ctc=safe_float(data.get("Expected CTC", 0)),
                    notice_period=safe_int(data.get("Notice Period (Days)", 0)),
                    work_mode=str(data.get("Work Mode", "Hybrid")).strip(),
                    willing_to_relocate=willing_to_relocate,
                    profile_completeness=85
                )
                db.add(new_student)
                await db.flush()

                # 3. Create Preferences
                pref_roles = [r.strip() for r in str(data.get("Preferred Roles", "")).split(",") if r.strip()]
                pref_locs = [l.strip() for l in str(data.get("Preferred Locations", "")).split(",") if l.strip()]
                
                new_prefs = StudentPreference(
                    student_id=new_student.id,
                    preferred_roles=pref_roles,
                    preferred_locations=pref_locs
                )
                db.add(new_prefs)

                # 4. Create Skills
                skills_str = str(data.get("Skills", ""))
                skills_list = [s.strip() for s in skills_str.split(",") if s.strip()]
                
                for skill in skills_list:
                    skill_name = skill
                    proficiency = "Intermediate"
                    
                    if "(" in skill and ")" in skill:
                        parts = skill.split("(")
                        skill_name = parts[0].strip()
                        proficiency = parts[1].replace(")", "").strip()
                        
                    new_skill = StudentSkill(
                        student_id=new_student.id,
                        skill_name=skill_name,
                        category="General",
                        proficiency=proficiency
                    )
                    db.add(new_skill)

                success_count += 1
                
            except Exception as e:
                await db.rollback()
                error_count += 1
                errors.append({"row": row_data.get('row_num'), "errors": [str(e)]})
                
        await db.commit()
        return success_count, error_count, errors
