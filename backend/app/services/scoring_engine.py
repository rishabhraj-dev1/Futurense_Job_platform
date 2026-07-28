from app.models.student import Student
from app.models.job import Job
from typing import Dict, Any, Tuple, List

class ScoringEngine:
    @staticmethod
    def calculate_score(student: Student, job: Job) -> Tuple[float, str, List[str], List[str], str, Dict[str, Any]]:
        score = 0.0
        breakdown = {}
        matched_skills = []
        missing_skills = []
        reasons = []

        # 1. Role match (25%)
        role_score = 0
        preferred_roles = student.preferences.preferred_roles if student.preferences else []
        if preferred_roles:
            job_title_lower = job.title.lower()
            for role in preferred_roles:
                if role.lower() in job_title_lower or job_title_lower in role.lower():
                    role_score = 25
                    reasons.append("Strong role match.")
                    break
            if role_score == 0:
                role_score = 5 # Partial point for trying
                reasons.append("Role doesn't directly match preferences.")
        else:
            role_score = 15 # Neutral if no prefs
        score += role_score
        breakdown['role_match'] = role_score

        # 2. Skills overlap (25%)
        skills_score = 0
        student_skills_set = {s.skill_name.lower() for s in student.skills} if student.skills else set()
        job_skills_set = {s.lower() for s in job.skills_required} if job.skills_required else set()
        
        if job_skills_set:
            matched_set = student_skills_set.intersection(job_skills_set)
            matched_skills = list(matched_set)
            missing_skills = list(job_skills_set - student_skills_set)
            
            overlap_ratio = len(matched_set) / len(job_skills_set)
            skills_score = overlap_ratio * 25
            
            if overlap_ratio >= 0.8:
                reasons.append("Excellent skills match.")
            elif overlap_ratio >= 0.4:
                reasons.append("Good skills foundation, some upskilling needed.")
            else:
                reasons.append("Significant skills gap.")
        else:
            skills_score = 20 # If job doesn't specify skills, give benefit of doubt
            
        score += skills_score
        breakdown['skills_overlap'] = skills_score

        # 3. Location fit (15%)
        location_score = 0
        preferred_locs = student.preferences.preferred_locations if student.preferences else []
        if job.location and job.location.lower() == "remote":
            location_score = 15
            reasons.append("Remote position.")
        elif job.work_mode and job.work_mode.lower() == "remote":
            location_score = 15
            reasons.append("Remote work mode.")
        elif preferred_locs and job.location:
            job_loc_lower = job.location.lower()
            for loc in preferred_locs:
                if loc.lower() in job_loc_lower:
                    location_score = 15
                    reasons.append("Preferred location match.")
                    break
            if location_score == 0 and student.willing_to_relocate:
                location_score = 10
                reasons.append("Willing to relocate.")
        else:
            location_score = 10
            
        score += location_score
        breakdown['location_fit'] = location_score

        # 4. Salary fit (15%)
        salary_score = 0
        if student.expected_ctc and job.salary_max:
            if student.expected_ctc <= job.salary_max:
                salary_score = 15
                reasons.append("Salary expectations met.")
            elif student.expected_ctc <= job.salary_max * 1.2:
                salary_score = 10
                reasons.append("Salary slightly below expectations.")
            else:
                salary_score = 0
                reasons.append("Salary gap.")
        else:
            salary_score = 10 # Unknown
            
        score += salary_score
        breakdown['salary_fit'] = salary_score
        
        # 5. Work mode fit (10%)
        mode_score = 0
        if student.work_mode and job.work_mode:
            if student.work_mode.lower() == job.work_mode.lower():
                mode_score = 10
            else:
                mode_score = 5
        else:
            mode_score = 8
            
        score += mode_score
        breakdown['work_mode_fit'] = mode_score
        
        # 6. Notice Period (5%) & 7. Recency (5%) simplified for mock
        score += 10
        breakdown['availability_recency'] = 10

        # Determine band
        fit_band = "Low"
        if score >= 80: fit_band = "Excellent"
        elif score >= 60: fit_band = "Good"
        elif score >= 40: fit_band = "Fair"

        reason_summary = " ".join(reasons)
        
        return round(score, 1), fit_band, matched_skills, missing_skills, reason_summary, breakdown
