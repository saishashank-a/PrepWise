export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatting: number;
  sectionStructure: number;
  actionVerbs: number;
  missingKeywords: string[];
  formattingIssues: string[];
}

export interface ResumeSection {
  id: string;
  type: "summary" | "skills" | "experience" | "education" | "projects";
  title: string;
  content: string;
}

export interface TailoredResume {
  id: string;
  roleTitle: string;
  company: string;
  jdText: string;
  sections: ResumeSection[];
  fullDocument: string;
  atsScore: number | null;
  createdAt: string;
  updatedAt: string;
}
