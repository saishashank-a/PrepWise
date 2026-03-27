"use client";

import dynamic from "next/dynamic";
import { useEditorStore } from "@/stores/useEditorStore";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-surface rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-xs text-text-dim">Loading editor...</span>
    </div>
  ),
});

const LANGUAGE_MAP: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  sql: "sql",
  java: "java",
};

interface CodeEditorProps {
  onRun?: () => void;
}

export default function CodeEditor({ onRun }: CodeEditorProps) {
  const { code, language, setCode } = useEditorStore();

  return (
    <div className="h-full rounded-xl overflow-hidden border border-border-subtle">
      <Editor
        height="100%"
        language={LANGUAGE_MAP[language]}
        value={code}
        theme="vs-dark"
        onChange={(value) => setCode(value || "")}
        onMount={(editor) => {
          // Cmd/Ctrl+Enter to run
          editor.addAction({
            id: "run-code",
            label: "Run Code",
            keybindings: [2048 | 3], // CtrlCmd + Enter
            run: () => onRun?.(),
          });
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 12 },
          lineNumbers: "on",
          renderLineHighlight: "line",
          scrollbar: { verticalScrollbarSize: 6 },
        }}
      />
    </div>
  );
}
