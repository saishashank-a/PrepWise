export type ApplicationStatus = "to_apply" | "applied" | "interviewing" | "offer" | "rejected";
export type Priority = "high" | "medium" | "low";

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  priority: Priority | null;
  appliedDate: string | null;
  interviewDate: string | null;
  interviewLink: string | null;
  jd: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_COLUMNS: { key: ApplicationStatus; label: string }[] = [
  { key: "to_apply", label: "To Apply" },
  { key: "applied", label: "Applied" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
];
