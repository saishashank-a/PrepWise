import type { ATSScore } from "./resumeTypes";
import { extractSkillsFromText } from "./skillExtractor";
import { isAIConfigured, getAI } from "./ai";

const STANDARD_SECTIONS = [
  { name: "summary", patterns: [/\b(summary|objective|profile|about)\b/i] },
  { name: "experience", patterns: [/\b(experience|employment|work history)\b/i] },
  { name: "education", patterns: [/\b(education|academic|degree|university)\b/i] },
  { name: "skills", patterns: [/\b(skills|technical skills|competencies)\b/i] },
];

const ACTION_VERBS = [
  "achieved", "built", "created", "delivered", "designed", "developed",
  "drove", "enabled", "engineered", "established", "executed", "improved",
  "implemented", "increased", "launched", "led", "managed", "migrated",
  "optimized", "orchestrated", "reduced", "refactored", "resolved",
  "scaled", "shipped", "spearheaded", "streamlined", "transformed",
  "architected", "automated", "collaborated", "configured", "consolidated",
  "deployed", "diagnosed", "enhanced", "expanded", "facilitated",
  "formulated", "generated", "integrated", "maintained", "mentored",
  "modernized", "negotiated", "oversaw", "pioneered", "prioritized",
];

function scoreKeywordMatch(resumeText: string, jdText: string): { score: number; missing: string[] } {
  const jdKeywords = extractSkillsFromText(jdText);
  if (jdKeywords.length === 0) return { score: 100, missing: [] };

  const resumeLower = resumeText.toLowerCase();
  const missing: string[] = [];
  let matched = 0;

  for (const keyword of jdKeywords) {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matched++;
    } else {
      missing.push(keyword);
    }
  }

  return {
    score: Math.round((matched / jdKeywords.length) * 100),
    missing,
  };
}

function scoreFormatting(resumeText: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let deductions = 0;

  const lines = resumeText.split("\n");
  const tableLines = lines.filter((l) => /\s{4,}\S+\s{4,}\S+/.test(l));
  if (tableLines.length > 3) {
    issues.push("Tables detected — most ATS systems can't parse them");
    deductions += 25;
  }

  const longLines = lines.filter((l) => l.trim().length > 150);
  if (longLines.length > 5) {
    issues.push("Very long lines — may cause parsing issues");
    deductions += 10;
  }

  if (/[│┃┤├┼─━┏┓┗┛]/.test(resumeText)) {
    issues.push("Special box-drawing characters detected — use plain text");
    deductions += 15;
  }

  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 100) {
    issues.push("Resume appears too short — aim for 300-600 words");
    deductions += 20;
  } else if (wordCount > 1200) {
    issues.push("Resume may be too long — consider trimming to 1-2 pages");
    deductions += 10;
  }

  return { score: Math.max(0, 100 - deductions), issues };
}

function scoreSectionStructure(resumeText: string): number {
  const textLower = resumeText.toLowerCase();
  let found = 0;

  for (const section of STANDARD_SECTIONS) {
    if (section.patterns.some((p) => p.test(textLower))) {
      found++;
    }
  }

  return Math.round((found / STANDARD_SECTIONS.length) * 100);
}

function scoreActionVerbs(resumeText: string): number {
  const textLower = resumeText.toLowerCase();
  const lines = textLower.split("\n").filter((l) => l.trim().length > 10);

  const bulletLines = lines.filter(
    (l) => /^\s*[-•*▸▹]/.test(l) || /^\s*\d+[.)]\s/.test(l),
  );

  const linesToCheck = bulletLines.length > 3 ? bulletLines : lines;
  if (linesToCheck.length === 0) return 50;

  let verbCount = 0;
  for (const line of linesToCheck) {
    const firstWords = line.trim().split(/\s+/).slice(0, 3).join(" ");
    if (ACTION_VERBS.some((v) => firstWords.includes(v))) {
      verbCount++;
    }
  }

  return Math.min(100, Math.round((verbCount / Math.max(linesToCheck.length * 0.5, 1)) * 100));
}

export async function calculateATSScore(resumeText: string, jdText: string): Promise<ATSScore> {
  const { score: keywordScore, missing } = scoreKeywordMatch(resumeText, jdText);
  const { score: formatScore, issues } = scoreFormatting(resumeText);
  const sectionScore = scoreSectionStructure(resumeText);
  const verbScore = scoreActionVerbs(resumeText);

  let result: ATSScore = {
    keywordMatch: keywordScore,
    formatting: formatScore,
    sectionStructure: sectionScore,
    actionVerbs: verbScore,
    overall: Math.round(keywordScore * 0.4 + formatScore * 0.2 + sectionScore * 0.2 + verbScore * 0.2),
    missingKeywords: missing,
    formattingIssues: issues,
  };

  if (isAIConfigured()) {
    try {
      const ai = getAI();
      const prompt = `Analyze this resume against the job description. Return ONLY a JSON object with:
{
  "keywordMatchAdjustment": <number -20 to +20, adjust for semantic matches the keyword check missed>,
  "formattingIssues": [<array of string issues not caught by basic checks>],
  "actionVerbAdjustment": <number -20 to +20, adjust based on quality of achievement descriptions>
}

Resume (first 2000 chars):
${resumeText.slice(0, 2000)}

Job Description (first 1500 chars):
${jdText.slice(0, 1500)}`;

      const response = await ai.generate(prompt, "You are an ATS expert. Return only valid JSON, no markdown fences.");
      const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const adjustments = JSON.parse(cleaned);

      result.keywordMatch = Math.max(0, Math.min(100, result.keywordMatch + (adjustments.keywordMatchAdjustment || 0)));
      result.actionVerbs = Math.max(0, Math.min(100, result.actionVerbs + (adjustments.actionVerbAdjustment || 0)));

      if (Array.isArray(adjustments.formattingIssues)) {
        result.formattingIssues = [...result.formattingIssues, ...adjustments.formattingIssues];
      }

      result.overall = Math.round(
        result.keywordMatch * 0.4 + result.formatting * 0.2 + result.sectionStructure * 0.2 + result.actionVerbs * 0.2,
      );
    } catch {
      // AI failed — local scores are fine
    }
  }

  return result;
}
