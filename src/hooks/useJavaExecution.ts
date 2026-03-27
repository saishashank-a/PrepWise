"use client";

import { useCallback } from "react";

interface JavaResult {
  stdout: string;
  error: string | null;
}

export function useJavaExecution() {
  const run = useCallback(
    async (code: string, stdin?: string): Promise<JavaResult> => {
      const clientId = process.env.NEXT_PUBLIC_JDOODLE_CLIENT_ID;
      const clientSecret = process.env.NEXT_PUBLIC_JDOODLE_SECRET;

      if (!clientId || !clientSecret) {
        return {
          stdout: "",
          error:
            "Java execution is not configured. Set NEXT_PUBLIC_JDOODLE_CLIENT_ID and NEXT_PUBLIC_JDOODLE_SECRET in environment variables.",
        };
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId,
            clientSecret,
            script: code,
            stdin: stdin || "",
            language: "java",
            versionIndex: "5",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        const data = await response.json();

        if (data.statusCode === 200) {
          return { stdout: data.output || "", error: null };
        }

        if (data.error === "Daily limit reached") {
          return {
            stdout: "",
            error:
              "Java execution daily limit reached (200/day). Try Python or JavaScript instead.",
          };
        }

        return { stdout: "", error: data.output || data.error || "Execution failed" };
      } catch (e: any) {
        clearTimeout(timeout);
        if (e.name === "AbortError") {
          return { stdout: "", error: "Execution timed out (15s)" };
        }
        return { stdout: "", error: `Network error: ${e.message}` };
      }
    },
    [],
  );

  return { run };
}
