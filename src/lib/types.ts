export interface Skill {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  source: "resume" | "manual";
}

export interface JDSkill {
  name: string;
  required: boolean;
}

export interface Profile {
  resumeText: string;
  skills: Skill[];
  jdText: string;
  jdSkills: JDSkill[];
  updatedAt?: Date;
}

export interface GapItem {
  skill: string;
  inResume: boolean;
  inJD: boolean;
  level?: Skill["level"];
  required?: boolean;
}

export type TopicType = "coding" | "sql" | "conceptual" | "system-design" | "behavioral";
export type TopicStatus = "not_started" | "in_progress" | "completed";
export type Difficulty = "easy" | "medium" | "hard";

export interface Topic {
  id: string;
  title: string;
  type: TopicType;
  status: TopicStatus;
  priority: number;
  difficulty: Difficulty;
}

export interface Plan {
  id: string;
  title: string;
  jdText: string;
  topics: Topic[];
  createdAt?: Date;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  error: string | null;
}

export interface Submission {
  topicId: string;
  assignmentId: string;
  code: string;
  language: Language;
  passed: boolean;
  output: string;
  testResults?: TestResult[];
  submittedAt?: Date;
}

export type Language = "python" | "javascript" | "sql" | "java";
