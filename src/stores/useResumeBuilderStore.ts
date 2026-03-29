import { create } from "zustand";
import type { TailoredResume, ATSScore } from "@/lib/resumeTypes";
import {
  getOrCreateSession,
  saveResumes,
  getResumes,
  isFirebaseConfigured,
} from "@/lib/firebase";

const STORAGE_KEY = "prepwise_resumes";

interface ResumeBuilderState {
  resumes: TailoredResume[];
  currentScore: ATSScore | null;
  generating: boolean;
  activeTab: "ats" | "generate" | "library";
  editingResume: TailoredResume | null;
  loaded: boolean;

  setActiveTab: (tab: "ats" | "generate" | "library") => void;
  setCurrentScore: (score: ATSScore | null) => void;
  setGenerating: (generating: boolean) => void;
  setEditingResume: (resume: TailoredResume | null) => void;
  addResume: (resume: TailoredResume) => void;
  updateResume: (id: string, updates: Partial<TailoredResume>) => void;
  deleteResume: (id: string) => void;
  persist: () => Promise<void>;
  load: () => Promise<void>;
}

function saveToLocalStorage(resumes: TailoredResume[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  } catch {
    // localStorage full or unavailable
  }
}

function loadFromLocalStorage(): TailoredResume[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set, get) => ({
  resumes: [],
  currentScore: null,
  generating: false,
  activeTab: "ats",
  editingResume: null,
  loaded: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentScore: (score) => set({ currentScore: score }),
  setGenerating: (generating) => set({ generating }),
  setEditingResume: (resume) => set({ editingResume: resume }),

  addResume: (resume) =>
    set((state) => ({ resumes: [resume, ...state.resumes] })),

  updateResume: (id, updates) =>
    set((state) => ({
      resumes: state.resumes.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r,
      ),
    })),

  deleteResume: (id) =>
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
    })),

  persist: async () => {
    const { resumes } = get();
    saveToLocalStorage(resumes);

    if (isFirebaseConfigured()) {
      const sessionId = getOrCreateSession();
      if (sessionId) {
        await saveResumes(sessionId, resumes);
      }
    }
  },

  load: async () => {
    if (isFirebaseConfigured()) {
      const sessionId = getOrCreateSession();
      if (sessionId) {
        const data = await getResumes(sessionId);
        if (data) {
          set({ resumes: data, loaded: true });
          return;
        }
      }
    }

    const local = loadFromLocalStorage();
    set({ resumes: local || [], loaded: true });
  },
}));
