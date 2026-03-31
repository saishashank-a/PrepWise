import { create } from "zustand";
import { Application, ApplicationStatus } from "@/lib/applicationTypes";

interface ApplicationStore {
  applications: Application[];
  loaded: boolean;
  addApplication: (app: Omit<Application, "id" | "createdAt" | "updatedAt">) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  moveApplication: (id: string, status: ApplicationStatus) => void;
  deleteApplication: (id: string) => void;
  getByStatus: (status: ApplicationStatus) => Application[];
  getStats: () => { reached: number; responseRate: number; offers: number };
  persist: () => void;
  load: () => void;
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  loaded: false,

  addApplication: (app) => {
    const now = new Date().toISOString();
    const newApp: Application = {
      ...app,
      id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ applications: [...state.applications, newApp] }));
    get().persist();
  },

  updateApplication: (id, updates) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString() } : app
      ),
    }));
    get().persist();
  },

  moveApplication: (id, status) => {
    get().updateApplication(id, { status });
  },

  deleteApplication: (id) => {
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    }));
    get().persist();
  },

  getByStatus: (status) => {
    return get().applications.filter((app) => app.status === status);
  },

  getStats: () => {
    const apps = get().applications;
    const reached = apps.filter((a) => a.status !== "to_apply").length;
    const withResponse = apps.filter(
      (a) => a.status === "interviewing" || a.status === "offer"
    ).length;
    const responseRate = reached > 0 ? Math.round((withResponse / reached) * 100) : 0;
    const offers = apps.filter((a) => a.status === "offer").length;
    return { reached, responseRate, offers };
  },

  persist: () => {
    const { applications } = get();
    localStorage.setItem("prepwise_applications", JSON.stringify(applications));
  },

  load: () => {
    try {
      const stored = localStorage.getItem("prepwise_applications");
      if (stored) {
        set({ applications: JSON.parse(stored), loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },
}));
