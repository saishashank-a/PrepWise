import { create } from "zustand";
import type { Plan, Topic, TopicStatus } from "@/lib/types";
import {
  getOrCreateSession,
  savePlan as savePlanToFirebase,
  getPlan as getPlanFromFirebase,
  isFirebaseConfigured,
} from "@/lib/firebase";

const STORAGE_KEY = "prepwise_plan";

interface PlanState {
  plan: Plan | null;
  loaded: boolean;

  createPlan: (title: string) => void;
  addTopic: (topic: Topic) => void;
  removeTopic: (topicId: string) => void;
  updateTopicStatus: (topicId: string, status: TopicStatus) => void;
  moveTopic: (topicId: string, direction: "up" | "down") => void;
  getCompletionPercentage: () => number;
  persist: () => Promise<void>;
  load: () => Promise<void>;
}

function saveToLocalStorage(plan: Plan | null) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {
    // silently ignore
  }
}

function loadFromLocalStorage(): Plan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plan: null,
  loaded: false,

  createPlan: (title) => {
    const plan: Plan = {
      id: `plan_${Date.now()}`,
      title,
      jdText: "",
      topics: [],
    };
    set({ plan });
  },

  addTopic: (topic) =>
    set((state) => {
      if (!state.plan) return state;
      if (state.plan.topics.some((t) => t.id === topic.id)) return state;
      return {
        plan: {
          ...state.plan,
          topics: [...state.plan.topics, topic],
        },
      };
    }),

  removeTopic: (topicId) =>
    set((state) => {
      if (!state.plan) return state;
      return {
        plan: {
          ...state.plan,
          topics: state.plan.topics
            .filter((t) => t.id !== topicId)
            .map((t, i) => ({ ...t, priority: i + 1 })),
        },
      };
    }),

  updateTopicStatus: (topicId, status) =>
    set((state) => {
      if (!state.plan) return state;
      return {
        plan: {
          ...state.plan,
          topics: state.plan.topics.map((t) =>
            t.id === topicId ? { ...t, status } : t,
          ),
        },
      };
    }),

  moveTopic: (topicId, direction) =>
    set((state) => {
      if (!state.plan) return state;
      const topics = [...state.plan.topics];
      const index = topics.findIndex((t) => t.id === topicId);
      if (index === -1) return state;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= topics.length) return state;

      [topics[index], topics[newIndex]] = [topics[newIndex], topics[index]];
      const reindexed = topics.map((t, i) => ({ ...t, priority: i + 1 }));

      return { plan: { ...state.plan, topics: reindexed } };
    }),

  getCompletionPercentage: () => {
    const { plan } = get();
    if (!plan || plan.topics.length === 0) return 0;
    const completed = plan.topics.filter((t) => t.status === "completed").length;
    return Math.round((completed / plan.topics.length) * 100);
  },

  persist: async () => {
    const { plan } = get();
    saveToLocalStorage(plan);

    if (plan && isFirebaseConfigured()) {
      const sessionId = getOrCreateSession();
      if (sessionId) {
        await savePlanToFirebase(sessionId, plan);
      }
    }
  },

  load: async () => {
    if (isFirebaseConfigured()) {
      const sessionId = getOrCreateSession();
      if (sessionId) {
        const data = await getPlanFromFirebase(sessionId);
        if (data) {
          set({
            plan: {
              id: data.id || "",
              title: data.title || "",
              jdText: data.jdText || "",
              topics: data.topics || [],
            },
            loaded: true,
          });
          return;
        }
      }
    }

    const local = loadFromLocalStorage();
    if (local) {
      set({ plan: local, loaded: true });
    } else {
      set({ loaded: true });
    }
  },
}));
