"use client";

import { useRef, useState, useCallback } from "react";

interface PyodideResult {
  stdout: string;
  stderr: string;
  error: string | null;
}

export function usePyodide() {
  const pyodideRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const init = useCallback(async () => {
    if (pyodideRef.current) return;
    setLoading(true);
    try {
      const { loadPyodide } = await import("pyodide");
      pyodideRef.current = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
      });
      setReady(true);
    } catch (e: any) {
      throw new Error(`Failed to load Python runtime: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const run = useCallback(
    async (code: string, stdin?: string): Promise<PyodideResult> => {
      if (!pyodideRef.current) await init();
      const pyodide = pyodideRef.current;

      // Reset stdout/stderr
      pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // Provide stdin if needed
      if (stdin) {
        pyodide.runPython(`
import io
sys.stdin = io.StringIO(${JSON.stringify(stdin)})
`);
      }

      // Execute with timeout
      return new Promise<PyodideResult>((resolve) => {
        const timeout = setTimeout(() => {
          resolve({
            stdout: "",
            stderr: "",
            error: "Execution timed out (10s). Check for infinite loops.",
          });
        }, 10000);

        try {
          pyodide.runPython(code);
          const stdout = pyodide.runPython("sys.stdout.getvalue()") as string;
          const stderr = pyodide.runPython("sys.stderr.getvalue()") as string;
          clearTimeout(timeout);
          resolve({ stdout, stderr, error: null });
        } catch (e: any) {
          clearTimeout(timeout);
          let stderr = "";
          try {
            stderr = pyodide.runPython("sys.stderr.getvalue()") as string;
          } catch {
            // ignore
          }
          resolve({ stdout: "", stderr, error: e.message });
        }
      });
    },
    [init],
  );

  return { run, loading, ready, init };
}
