import { create } from "zustand";
import type { Language, TestResult } from "@/lib/types";

const DRAFT_PREFIX = "prepwise_draft_";

interface EditorState {
  code: string;
  language: Language;
  output: string;
  error: string | null;
  running: boolean;
  testResults: TestResult[] | null;

  setCode: (code: string) => void;
  setLanguage: (lang: Language) => void;
  setOutput: (output: string, error?: string | null) => void;
  setRunning: (running: boolean) => void;
  setTestResults: (results: TestResult[] | null) => void;
  reset: () => void;
  saveDraft: (questionId: string) => void;
  loadDraft: (questionId: string, starterCode: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  code: "",
  language: "python",
  output: "",
  error: null,
  running: false,
  testResults: null,

  setCode: (code) => set({ code }),
  setLanguage: (lang) => set({ language: lang }),
  setOutput: (output, error = null) => set({ output, error }),
  setRunning: (running) => set({ running }),
  setTestResults: (results) => set({ testResults: results }),

  reset: () =>
    set({
      code: "",
      output: "",
      error: null,
      running: false,
      testResults: null,
    }),

  saveDraft: (questionId) => {
    if (typeof window === "undefined") return;
    const { code, language } = get();
    try {
      localStorage.setItem(`${DRAFT_PREFIX}${questionId}_${language}`, code);
    } catch {
      // silently ignore
    }
  },

  loadDraft: (questionId, starterCode) => {
    if (typeof window === "undefined") {
      set({ code: starterCode });
      return;
    }
    const { language } = get();
    try {
      const draft = localStorage.getItem(`${DRAFT_PREFIX}${questionId}_${language}`);
      set({ code: draft || starterCode });
    } catch {
      set({ code: starterCode });
    }
  },
}));
