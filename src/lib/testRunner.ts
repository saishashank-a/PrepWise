import type { Language, TestCase, TestResult } from "./types";
import { executeCode, type Executors } from "./executors";

export async function runTests(
  code: string,
  language: Language,
  testCases: TestCase[],
  executors: Executors,
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for (const tc of testCases) {
    const { stdout, error } = await executeCode(language, code, executors, tc.input);
    const actualOutput = stdout.trim();
    const expectedOutput = tc.expectedOutput.trim();

    results.push({
      testCase: tc,
      passed: !error && actualOutput === expectedOutput,
      actualOutput: error ? `Error: ${error}` : actualOutput,
      error,
    });
  }

  return results;
}
