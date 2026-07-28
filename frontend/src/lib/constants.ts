export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  RECRUITER: "recruiter",
} as const;

export const APP_STATUS = {
  INTERESTED: "interested",
  APPLIED: "applied",
  INTERVIEWING: "interviewing",
  OFFER: "offer",
  REJECTED: "rejected",
} as const;

export const FIT_BANDS = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  LOW: "Low",
} as const;
