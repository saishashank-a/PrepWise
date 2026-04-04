import { getAI } from "@/lib/ai";

export interface InterviewQuestion {
  id: string;
  category: "behavioral" | "technical" | "system-design";
  question: string;
  hint: string;
}

export interface QuestionFeedback {
  score: number; // 1–5
  strengths: string;
  improvements: string;
  sampleAnswer: string;
}

export async function generateInterviewQuestions(
  company: string,
  role: string,
  jd: string,
): Promise<InterviewQuestion[]> {
  const ai = getAI();

  const prompt = `Generate 8 interview questions for a ${role} role at ${company}.

${jd ? `Job description:\n${jd.slice(0, 2000)}` : ""}

Return ONLY a JSON array:
[
  {
    "id": "q1",
    "category": "behavioral",
    "question": "Tell me about a time you...",
    "hint": "Focus on STAR method: Situation, Task, Action, Result"
  }
]

Rules:
- 3 behavioral questions (leadership, conflict, failure, collaboration)
- 3 technical questions specific to the role and JD skills
- 2 system design or role-specific scenario questions
- Keep questions realistic and commonly asked at top tech companies
- Hints should guide structure, not give the answer`;

  const response = await ai.generate(
    prompt,
    "You are a senior interviewer at a top tech company. Return only valid JSON, no markdown fences.",
  );

  try {
    const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  role: string,
  category: InterviewQuestion["category"],
): Promise<QuestionFeedback> {
  const ai = getAI();

  const prompt = `Evaluate this interview answer for a ${role} position.

Question: ${question}
Category: ${category}
Answer: ${answer.slice(0, 1500)}

Return ONLY a JSON object:
{
  "score": 4,
  "strengths": "What was done well (2-3 sentences)",
  "improvements": "Specific, actionable improvement suggestions (2-3 sentences)",
  "sampleAnswer": "A concise example of a strong answer structure (3-5 sentences)"
}

Scoring:
- 5: Exceptional — clear, specific, compelling STAR structure with measurable impact
- 4: Good — solid answer, minor gaps in specificity or impact
- 3: Adequate — covers basics but lacks depth or concrete examples
- 2: Weak — vague, missing key elements
- 1: Poor — off-topic or very incomplete`;

  const response = await ai.generate(
    prompt,
    "You are an experienced technical interviewer. Be honest but constructive. Return only valid JSON, no markdown fences.",
  );

  try {
    const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      score: 3,
      strengths: "Answer received.",
      improvements: "Could not parse AI feedback. Please try again.",
      sampleAnswer: "",
    };
  }
}
