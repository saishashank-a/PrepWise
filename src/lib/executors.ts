import type { Language } from "./types";

interface ExecutionResult {
  stdout: string;
  stderr?: string;
  error: string | null;
}

// --- JavaScript Sandbox Executor ---

export function executeJavaScript(code: string): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.sandbox.add("allow-scripts");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const timeout = setTimeout(() => {
      cleanup();
      resolve({ stdout: "", error: "Execution timed out (10s). Check for infinite loops." });
    }, 10000);

    function cleanup() {
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    }

    function handler(event: MessageEvent) {
      if (event.data?.type === "__prepwise_result__") {
        cleanup();
        resolve({
          stdout: event.data.stdout || "",
          error: event.data.error || null,
        });
      }
    }

    window.addEventListener("message", handler);

    const script = `<script>
const __logs = [];
console.log = (...args) => __logs.push(args.map(String).join(' '));
console.error = console.log;
console.warn = console.log;
try {
  ${code}
  parent.postMessage({ type: '__prepwise_result__', stdout: __logs.join('\\n'), error: null }, '*');
} catch(e) {
  parent.postMessage({ type: '__prepwise_result__', stdout: __logs.join('\\n'), error: e.message }, '*');
}
<\/script>`;

    iframe.srcdoc = script;
  });
}

// --- SQL Result Formatter ---

export function formatSQLResult(rows: Record<string, unknown>[], fields: string[]): string {
  if (rows.length === 0) return fields.length > 0 ? fields.join("\t") + "\n(0 rows)" : "(0 rows)";

  const header = fields.join("\t");
  const body = rows.map((row) => fields.map((f) => String(row[f] ?? "NULL")).join("\t")).join("\n");
  return `${header}\n${body}`;
}

// --- Language Router ---

export interface Executors {
  python: { run: (code: string, stdin?: string) => Promise<ExecutionResult> };
  sql: { run: (sql: string) => Promise<{ rows: Record<string, unknown>[]; fields: string[]; error: string | null }> };
  java: { run: (code: string, stdin?: string) => Promise<ExecutionResult> };
}

export async function executeCode(
  language: Language,
  code: string,
  executors: Executors,
  stdin?: string,
): Promise<ExecutionResult> {
  switch (language) {
    case "python":
      return executors.python.run(code, stdin);

    case "javascript":
      return executeJavaScript(code);

    case "sql": {
      const result = await executors.sql.run(code);
      if (result.error) {
        return { stdout: "", error: result.error };
      }
      return { stdout: formatSQLResult(result.rows, result.fields), error: null };
    }

    case "java":
      return executors.java.run(code, stdin);

    default:
      return { stdout: "", error: `Unsupported language: ${language}` };
  }
}
