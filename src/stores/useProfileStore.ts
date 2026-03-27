import { create } from "zustand";
import type { Skill, JDSkill, GapItem } from "@/lib/types";
import {
  getOrCreateSession,
  saveProfile,
  getProfile,
  isFirebaseConfigured,
} from "@/lib/firebase";

const STORAGE_KEY = "prepwise_profile";

interface ProfileState {
  resumeText: string;
  skills: Skill[];
  jdText: string;
  jdSkills: JDSkill[];
  loaded: boolean;

  setResumeText: (text: string) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (name: string) => void;
  updateSkillLevel: (name: string, level: Skill["level"]) => void;
  setJDText: (text: string) => void;
  addJDSkill: (skill: JDSkill) => void;
  removeJDSkill: (name: string) => void;
  getGapAnalysis: () => GapItem[];
  persist: () => Promise<void>;
  load: () => Promise<void>;
}

function saveToLocalStorage(data: {
  resumeText: string;
  skills: Skill[];
  jdText: string;
  jdSkills: JDSkill[];
}) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

function loadFromLocalStorage(): {
  resumeText: string;
  skills: Skill[];
  jdText: string;
  jdSkills: JDSkill[];
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  resumeText: "",
  skills: [],
  jdText: "",
  jdSkills: [],
  loaded: false,

  setResumeText: (text) => set({ resumeText: text }),

  addSkill: (skill) =>
    set((state) => {
      if (state.skills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase())) {
        return state;
      }
      return { skills: [...state.skills, skill] };
    }),

  removeSkill: (name) =>
    set((state) => ({
      skills: state.skills.filter((s) => s.name !== name),
    })),

  updateSkillLevel: (name, level) =>
    set((state) => ({
      skills: state.skills.map((s) => (s.name === name ? { ...s, level } : s)),
    })),

  setJDText: (text) => set({ jdText: text }),

  addJDSkill: (skill) =>
    set((state) => {
      if (state.jdSkills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase())) {
        return state;
      }
      return { jdSkills: [...state.jdSkills, skill] };
    }),

  removeJDSkill: (name) =>
    set((state) => ({
      jdSkills: state.jdSkills.filter((s) => s.name !== name),
    })),

  getGapAnalysis: () => {
    const { skills, jdSkills } = get();
    const allSkillNames = new Set([
      ...skills.map((s) => s.name.toLowerCase()),
      ...jdSkills.map((s) => s.name.toLowerCase()),
    ]);

    return Array.from(allSkillNames).map((name) => {
      const resumeSkill = skills.find((s) => s.name.toLowerCase() === name);
      const jdSkill = jdSkills.find((s) => s.name.toLowerCase() === name);
      return {
        skill: resumeSkill?.name || jdSkill?.name || name,
        inResume: !!resumeSkill,
        inJD: !!jdSkill,
        level: resumeSkill?.level,
        required: jdSkill?.required,
      };
    });
  },

  persist: async () => {
    const { resumeText, skills, jdText, jdSkills } = get();
    const data = { resumeText, skills, jdText, jdSkills };

    // Always persist to localStorage as a fallback
    saveToLocalStorage(data);

    // Also persist to Firebase if configured
    if (isFirebaseConfigured()) {
      const sessionId = getOrCreateSession();
      if (sessionId) {
        await saveProfile(sessionId, data);
      }
    }
  },

  load: async () => {
    // Try Firebase first if configured
    if (isFirebaseConfigured()) {
      const sessionId = getOrCreateSession();
      if (sessionId) {
        const data = await getProfile(sessionId);
        if (data) {
          set({
            resumeText: data.resumeText || "",
            skills: data.skills || [],
            jdText: data.jdText || "",
            jdSkills: data.jdSkills || [],
            loaded: true,
          });
          return;
        }
      }
    }

    // Fall back to localStorage
    const local = loadFromLocalStorage();
    if (local) {
      set({ ...local, loaded: true });
    } else {
      set({ loaded: true });
    }
  },
}));
