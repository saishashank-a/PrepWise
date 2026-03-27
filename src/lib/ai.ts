import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Provider Interface ---

export interface AIProvider {
  generate(prompt: string, systemPrompt?: string): Promise<string>;
  isConfigured(): boolean;
}

// --- Gemini Provider ---

class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI | null = null;

  private getClient(): GoogleGenerativeAI {
    if (!this.client) {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not configured");
      this.client = new GoogleGenerativeAI(apiKey);
    }
    return this.client;
  }

  isConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const client = this.getClient();
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  }
}

// --- Singleton ---

let provider: AIProvider | null = null;

export function getAI(): AIProvider {
  if (!provider) {
    provider = new GeminiProvider();
  }
  return provider;
}

export function isAIConfigured(): boolean {
  return getAI().isConfigured();
}

// --- AI Feature Functions ---

export async function extractSkillsFromResume(
  resumeText: string,
): Promise<{ name: string; level: "beginner" | "intermediate" | "advanced" }[]> {
  const ai = getAI();
  const prompt = `Extract technical skills from this resume text. For each skill, assess the proficiency level based on context (years of experience, project complexity, certifications).

Return ONLY a JSON array with objects like: [{"name": "Python", "level": "advanced"}, {"name": "React", "level": "intermediate"}]

Levels:
- "beginner": mentioned but no substantial experience
- "intermediate": used in projects, 1-3 years
- "advanced": deep experience, lead projects, 3+ years

Resume text:
${resumeText.slice(0, 3000)}`;

  const response = await ai.generate(prompt, "You are a technical recruiter analyzing resumes. Return only valid JSON arrays, no markdown fences.");

  try {
    const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export async function extractJDSkills(
  jdText: string,
): Promise<{ name: string; required: boolean }[]> {
  const ai = getAI();
  const prompt = `Extract required and nice-to-have skills from this job description.

Return ONLY a JSON array: [{"name": "Kubernetes", "required": true}, {"name": "GraphQL", "required": false}]

Job description:
${jdText.slice(0, 3000)}`;

  const response = await ai.generate(prompt, "You are a technical recruiter. Return only valid JSON arrays, no markdown fences.");

  try {
    const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export async function generateStudyPlanTopics(
  gaps: string[],
  resumeSkills: string[],
): Promise<{ title: string; type: string; difficulty: string; reason: string }[]> {
  const ai = getAI();
  const prompt = `Given these skill gaps and existing skills, suggest a prioritized study plan.

Skill gaps (missing from resume, required by job): ${gaps.join(", ")}
Existing skills: ${resumeSkills.join(", ")}

Return ONLY a JSON array of topics to study:
[{"title": "Topic Name", "type": "coding|sql|conceptual|system-design|behavioral", "difficulty": "easy|medium|hard", "reason": "Brief reason why this topic matters"}]

Prioritize the most impactful gaps first. Include 5-10 topics.`;

  const response = await ai.generate(prompt, "You are a senior software engineer and interview coach. Return only valid JSON arrays, no markdown fences.");

  try {
    const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export async function evaluateCode(
  code: string,
  language: string,
  problemDescription: string,
  testResults: { passed: boolean; description: string; actualOutput: string; expectedOutput: string }[],
): Promise<string> {
  const ai = getAI();
  const passed = testResults.filter((t) => t.passed).length;
  const total = testResults.length;

  const failedTests = testResults
    .filter((t) => !t.passed)
    .map((t) => `- ${t.description}: expected "${t.expectedOutput}", got "${t.actualOutput}"`)
    .join("\n");

  const prompt = `Review this ${language} code for an interview practice problem.

Problem: ${problemDescription.slice(0, 500)}

Code:
\`\`\`${language}
${code.slice(0, 2000)}
\`\`\`

Test results: ${passed}/${total} passed
${failedTests ? `\nFailed tests:\n${failedTests}` : "All tests passed!"}

Provide brief, actionable feedback:
1. If tests failed: hint at what's wrong WITHOUT giving the answer
2. Code quality: time/space complexity, naming, edge cases
3. If all passed: suggest optimizations or alternative approaches

Keep response under 200 words. Use markdown.`;

  return ai.generate(prompt, "You are a patient coding interview coach. Give helpful hints, not answers. Be encouraging but honest.");
}

export async function chatWithAI(
  topic: string,
  messages: { role: "user" | "assistant"; content: string }[],
  userMessage: string,
): Promise<string> {
  const ai = getAI();

  const history = messages
    .slice(-6)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");

  const prompt = `${history ? `Previous conversation:\n${history}\n\n` : ""}User: ${userMessage}`;

  const systemPrompt = `You are a friendly interview preparation coach helping with the topic: "${topic}".

Rules:
- Give clear, concise explanations
- Use examples and analogies
- For behavioral topics, teach the STAR method
- For system design, walk through trade-offs
- Keep responses under 300 words
- Use markdown for formatting`;

  return ai.generate(prompt, systemPrompt);
}
