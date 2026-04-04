// Known technical skills for keyword-based extraction (no AI needed)
const KNOWN_SKILLS = [
  // Languages
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Ruby",
  "PHP", "Swift", "Kotlin", "Scala", "R", "Perl", "Dart", "Lua", "Shell", "Bash",
  // Frontend
  "React", "Angular", "Vue", "Next.js", "Svelte", "HTML", "CSS", "Tailwind",
  "Bootstrap", "jQuery", "Redux", "GraphQL", "REST", "Webpack", "Vite",
  // Backend
  "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "Rails",
  "Laravel", "ASP.NET", "NestJS", "Gin", "Fiber",
  // Databases
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB",
  "Cassandra", "SQLite", "Oracle", "Firebase", "Supabase", "Prisma",
  // Cloud & DevOps
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible",
  "Jenkins", "CI/CD", "GitHub Actions", "CircleCI", "Nginx", "Linux",
  // Data & ML
  "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn", "Spark",
  "Hadoop", "Kafka", "Airflow", "dbt", "Tableau", "Power BI",
  // Tools & Practices
  "Git", "Jira", "Agile", "Scrum", "REST API", "Microservices",
  "System Design", "Data Structures", "Algorithms", "OOP",
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
  "Unit Testing", "TDD", "API Design",
];

// Build a lookup map for case-insensitive matching
const SKILL_MAP = new Map<string, string>();
for (const skill of KNOWN_SKILLS) {
  SKILL_MAP.set(skill.toLowerCase(), skill);
}

export function extractSkillsFromText(text: string): string[] {
  const found = new Set<string>();
  const lowerText = text.toLowerCase();

  for (const [lower, original] of SKILL_MAP) {
    // Word boundary check: skill must appear as a standalone word/phrase
    const regex = new RegExp(`\\b${lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(lowerText)) {
      found.add(original);
    }
  }

  // Also check for common variations
  if (/\bnode\.?js\b/i.test(text)) found.add("Node.js");
  if (/\bnext\.?js\b/i.test(text)) found.add("Next.js");
  if (/\breact\.?js\b/i.test(text)) found.add("React");
  if (/\bvue\.?js\b/i.test(text)) found.add("Vue");
  if (/\bc\+\+\b/i.test(text)) found.add("C++");
  if (/\bc#\b/i.test(text)) found.add("C#");
  if (/\b\.net\b/i.test(text)) found.add("ASP.NET");
  if (/\baws\b/i.test(text)) found.add("AWS");
  if (/\bgcp\b/i.test(text)) found.add("GCP");
  if (/\bci\s*\/\s*cd\b/i.test(text)) found.add("CI/CD");

  return Array.from(found);
}

export function guessSkillLevel(
  skill: string,
  text: string,
): "beginner" | "intermediate" | "advanced" {
  const lowerText = text.toLowerCase();
  const lowerSkill = skill.toLowerCase();

  // Check for experience indicators near the skill mention
  const idx = lowerText.indexOf(lowerSkill);
  if (idx === -1) return "intermediate";

  // Look at surrounding context (200 chars around)
  const context = lowerText.slice(Math.max(0, idx - 200), idx + 200);

  if (/(\d+\+?\s*years?|senior|lead|expert|architect|extensive|deep)/i.test(context)) {
    return "advanced";
  }
  if (/\b(junior|intern|basic|familiar|exposure|learning|beginner)\b/i.test(context)) {
    return "beginner";
  }
  return "intermediate";
}
