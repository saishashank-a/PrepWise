import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// Check if Firebase is configured (has a project ID)
export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.projectId;
}

// --- Session Management ---

export function getOrCreateSession(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("prepwise_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("prepwise_session_id", sessionId);
  }
  return sessionId;
}

// --- Profile ---

export async function saveProfile(
  sessionId: string,
  data: {
    resumeText: string;
    skills: { name: string; level: string; source: string }[];
    jdText: string;
    jdSkills: { name: string; required: boolean }[];
  },
) {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, "sessions", sessionId, "profile", "main"), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getProfile(sessionId: string) {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(db, "sessions", sessionId, "profile", "main"));
  return snap.exists() ? snap.data() : null;
}

// --- Plans ---

export async function savePlan(
  sessionId: string,
  plan: {
    id: string;
    title: string;
    jdText: string;
    topics: {
      id: string;
      title: string;
      type: string;
      priority: number;
      status: string;
      difficulty: string;
    }[];
  },
) {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, "sessions", sessionId, "plans", plan.id), {
    ...plan,
    createdAt: serverTimestamp(),
  });
}

export async function getPlan(sessionId: string) {
  if (!isFirebaseConfigured()) return null;
  const plansRef = collection(db, "sessions", sessionId, "plans");
  const q = query(plansRef, orderBy("createdAt", "desc"), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data();
}

// --- Submissions ---

export async function saveSubmission(
  sessionId: string,
  submission: {
    topicId: string;
    assignmentId: string;
    code: string;
    language: string;
    passed: boolean;
    output: string;
  },
) {
  if (!isFirebaseConfigured()) return;
  await addDoc(collection(db, "sessions", sessionId, "submissions"), {
    ...submission,
    submittedAt: serverTimestamp(),
  });
}

// --- Resumes ---

export async function saveResumes(
  sessionId: string,
  resumes: {
    id: string;
    roleTitle: string;
    company: string;
    jdText: string;
    sections: { id: string; type: string; title: string; content: string }[];
    fullDocument: string;
    atsScore: number | null;
    createdAt: string;
    updatedAt: string;
  }[],
) {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, "sessions", sessionId, "resumes", "all"), {
    resumes,
    updatedAt: serverTimestamp(),
  });
}

export async function getResumes(sessionId: string) {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(db, "sessions", sessionId, "resumes", "all"));
  return snap.exists() ? snap.data().resumes : null;
}
