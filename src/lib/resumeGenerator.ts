import type { ResumeSection } from "./resumeTypes";
import { getAI } from "./ai";

export async function generateTailoredSections(
  resumeText: string,
  jdText: string,
): Promise<ResumeSection[]> {
  const ai = getAI();

  const prompt = `You are a professional resume writer. Given the original resume and a target job description, create a tailored resume broken into sections.

Return ONLY a JSON array of sections:
[
  {"id": "summary", "type": "summary", "title": "Professional Summary", "content": "..."},
  {"id": "skills", "type": "skills", "title": "Technical Skills", "content": "Skill1, Skill2, ..."},
  {"id": "experience", "type": "experience", "title": "Professional Experience", "content": "**Company — Role** (dates)\\n- Achievement 1\\n- Achievement 2\\n..."},
  {"id": "education", "type": "education", "title": "Education", "content": "..."}
]

Rules:
- Rewrite the summary to align with the target role
- Prioritize skills mentioned in the JD
- Rewrite experience bullets with JD-relevant keywords and quantified achievements
- Keep all factual information from the original resume — do NOT fabricate experience
- Use strong action verbs to start each bullet point
- Include metrics where the original resume implies them

Original Resume:
${resumeText.slice(0, 3000)}

Target Job Description:
${jdText.slice(0, 2000)}`;

  const response = await ai.generate(
    prompt,
    "You are an expert resume writer and ATS optimization specialist. Return only valid JSON arrays, no markdown fences.",
  );

  const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateFullDocument(
  resumeText: string,
  jdText: string,
): Promise<string> {
  const ai = getAI();

  const prompt = `You are a professional resume writer. Rewrite this resume to be optimized for the target job description.

Rules:
- Keep all factual information — do NOT fabricate
- Align the summary/objective with the target role
- Prioritize JD-relevant skills
- Use strong action verbs and quantified achievements
- Format cleanly: section headers in ALL CAPS, bullet points with dashes
- Keep it concise — 1-2 pages worth of content

Original Resume:
${resumeText.slice(0, 3000)}

Target Job Description:
${jdText.slice(0, 2000)}

Return the complete resume as plain text, ready to be placed in a document.`;

  return ai.generate(
    prompt,
    "You are an expert resume writer. Return only the resume text, no commentary.",
  );
}

export async function regenerateSection(
  section: ResumeSection,
  resumeText: string,
  jdText: string,
): Promise<string> {
  const ai = getAI();

  const prompt = `Rewrite this "${section.title}" section of a resume to better match the target job description.

Current content:
${section.content}

Full resume context (first 1500 chars):
${resumeText.slice(0, 1500)}

Target Job Description (first 1000 chars):
${jdText.slice(0, 1000)}

Return ONLY the rewritten section content as plain text. No JSON, no markdown fences, no commentary.`;

  return ai.generate(
    prompt,
    "You are an expert resume writer. Return only the section content.",
  );
}
