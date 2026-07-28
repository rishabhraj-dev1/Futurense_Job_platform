// Types matching backend schemas

export interface User {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  role: string;
  name?: string;
}

export interface Skill {
  id?: number;
  skill_name: string;
  category: string;
  proficiency: string;
}

export interface Preferences {
  preferred_roles: string[];
  preferred_locations: string[];
}

export interface Student {
  id: number;
  user_id: number;
  phone?: string;
  current_company?: string;
  current_role?: string;
  current_ctc?: number;
  expected_ctc?: number;
  notice_period?: number;
  work_mode?: string;
  willing_to_relocate: boolean;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  bio?: string;
  profile_completeness: number;
  user?: User;
}

export interface StudentDetail extends Student {
  preferences?: Preferences;
  skills: Skill[];
}

export interface Job {
  id: number;
  external_id?: string;
  title: string;
  company: string;
  description: string;
  requirements?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  salary_range?: string;
  currency?: string;
  work_mode?: string;
  employment_type?: string;
  experience_required?: number;
  skills_required: string[];
  experience_min?: number;
  experience_max?: number;
  job_type?: string;
  source: string;
  source_url?: string;
  posted_at?: string;
  created_at: string;
  is_active: boolean;
}

export interface JobListResponse {
  items: Job[];
  total: number;
}

export interface Recommendation {
  id: number;
  student_id?: number;
  job_id?: number;
  fit_score: number;
  fit_band: string;
  matched_skills: string[];
  missing_skills?: string[];
  reason_summary?: string;
  score_breakdown?: any;
  created_at?: string;
  job: Job;
  match_score?: number;
  reasons?: string[];
}

export interface Application {
  id: number;
  student_id: number;
  job_id: number;
  status: string;
  notes?: string;
  applied_at?: string;
  created_at: string;
  updated_at: string;
  job?: Job;
  student?: Student;
}

export interface ImportPreviewRow {
  row_num: number;
  data: any;
  is_valid: boolean;
  errors: string[];
}

export interface ImportPreview {
  filename: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  preview_data: ImportPreviewRow[];
}

export interface ImportRecord {
  id: number;
  filename: string;
  status: string;
  total_rows: number;
  success_rows: number;
  error_rows: number;
  errors: any[];
  created_at: string;
  imported_by?: number;
}
