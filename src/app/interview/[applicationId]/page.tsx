"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApplicationStore } from "@/stores/useApplicationStore";
import AppLayout from "@/components/layout/AppLayout";
import {
  generateInterviewQuestions,
  evaluateAnswer,
  type InterviewQuestion,
  type QuestionFeedback,
} from "@/lib/interviewPrep";

const CATEGORY_LABEL: Record<InterviewQuestion["category"], string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  "system-design": "System Design",
};

const CATEGORY_COLOR: Record<InterviewQuestion["category"], string> = {
  behavioral: "bg-[#f0f7f4] text-[#1a6644]",
  technical: "bg-[#f0f4ff] text-[#1a3380]",
  "system-design": "bg-[#fff8f0] text-[#804d00]",
};

const SCORE_COLORS = ["", "bg-red-100 text-red-700", "bg-orange-100 text-orange-700", "bg-yellow-100 text-yellow-700", "bg-blue-100 text-blue-700", "bg-green-100 text-green-700"];

export default function InterviewPrepPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.applicationId as string;

  const { applications, load, loaded } = useApplicationStore();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, QuestionFeedback>>({});
  const [evaluating, setEvaluating] = useState<Record<string, boolean>>({});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) load();
  }, [load, loaded]);

  const app = applications.find((a) => a.id === applicationId);

  useEffect(() => {
    if (!app || questions.length > 0) return;
    setGenerating(true);
    setError(null);
    generateInterviewQuestions(app.company, app.role, app.jd || "")
      .then((qs) => {
        setQuestions(qs);
        if (qs.length > 0) setActiveQuestion(qs[0].id);
      })
      .catch(() => setError("Failed to generate questions. Check your API key."))
      .finally(() => setGenerating(false));
  }, [app, questions.length]);

  const handleEvaluate = async (q: InterviewQuestion) => {
    const answer = answers[q.id];
    if (!answer?.trim()) return;
    setEvaluating((e) => ({ ...e, [q.id]: true }));
    try {
      const feedback = await evaluateAnswer(q.question, answer, app!.role, q.category);
      setFeedbacks((f) => ({ ...f, [q.id]: feedback }));
    } finally {
      setEvaluating((e) => ({ ...e, [q.id]: false }));
    }
  };

  if (!loaded) {
    return (
      <AppLayout>
        <div className="p-10 text-sm text-[#777]">Loading...</div>
      </AppLayout>
    );
  }

  if (!app) {
    return (
      <AppLayout>
        <div className="p-10">
          <p className="text-sm text-[#474747]">Application not found.</p>
          <button onClick={() => router.push("/tracker")} className="mt-4 text-sm underline">
            Back to Tracker
          </button>
        </div>
      </AppLayout>
    );
  }

  const activeQ = questions.find((q) => q.id === activeQuestion);
  const answeredCount = Object.values(answers).filter((a) => a.trim()).length;

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar — question list */}
        <aside className="w-72 shrink-0 border-r border-black/[0.06] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-black/[0.06]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#777] mb-1">Interview Prep</p>
            <h1 className="font-black tracking-tighter text-xl text-[#191c1c] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              {app.company}
            </h1>
            <p className="text-xs text-[#474747] mt-0.5">{app.role}</p>
            {questions.length > 0 && (
              <p className="text-[11px] text-[#777] mt-3">
                {answeredCount}/{questions.length} answered
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {generating && (
              <div className="flex flex-col gap-2 p-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-12 bg-[#f2f4f3] rounded-xl animate-pulse" />
                ))}
              </div>
            )}
            {questions.map((q, i) => {
              const hasAnswer = !!answers[q.id]?.trim();
              const hasFeedback = !!feedbacks[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestion(q.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    activeQuestion === q.id
                      ? "bg-[#191c1c] text-white"
                      : "hover:bg-[#f2f4f3] text-[#191c1c]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      activeQuestion === q.id ? "bg-white/10 text-white/70" : CATEGORY_COLOR[q.category]
                    }`}>
                      {CATEGORY_LABEL[q.category]}
                    </span>
                    <div className="flex items-center gap-1">
                      {hasFeedback && (
                        <span className="text-[10px] font-bold text-green-500">
                          {feedbacks[q.id].score}/5
                        </span>
                      )}
                      {hasAnswer && !hasFeedback && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs leading-snug line-clamp-2">
                    {i + 1}. {q.question}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main — active question */}
        <main className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {generating && !activeQ && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#777]">
              <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
              <p className="text-sm">Generating questions for {app.company}...</p>
            </div>
          )}

          {activeQ && (
            <div className="max-w-2xl">
              {/* Question */}
              <div className="mb-6">
                <span className={`text-[10px] font-mono px-2 py-1 rounded-lg ${CATEGORY_COLOR[activeQ.category]}`}>
                  {CATEGORY_LABEL[activeQ.category]}
                </span>
                <h2 className="mt-3 text-xl font-bold text-[#191c1c] leading-snug">
                  {activeQ.question}
                </h2>
                <p className="mt-2 text-sm text-[#777] italic">
                  Hint: {activeQ.hint}
                </p>
              </div>

              {/* Answer */}
              <div className="mb-4">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[#777] block mb-2">
                  Your Answer
                </label>
                <textarea
                  value={answers[activeQ.id] || ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [activeQ.id]: e.target.value }))}
                  placeholder="Type your answer here... Be specific and use examples from your experience."
                  rows={8}
                  className="w-full bg-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black/10 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 mb-8">
                <button
                  onClick={() => handleEvaluate(activeQ)}
                  disabled={!answers[activeQ.id]?.trim() || evaluating[activeQ.id]}
                  className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-black/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {evaluating[activeQ.id] ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    "Get AI Feedback"
                  )}
                </button>
                {/* Next question */}
                {(() => {
                  const idx = questions.findIndex((q) => q.id === activeQ.id);
                  const next = questions[idx + 1];
                  return next ? (
                    <button
                      onClick={() => setActiveQuestion(next.id)}
                      className="px-5 py-2.5 border border-black/15 text-sm text-[#474747] rounded-xl hover:bg-[#f2f4f3] transition-colors"
                    >
                      Next →
                    </button>
                  ) : null;
                })()}
              </div>

              {/* Feedback */}
              {feedbacks[activeQ.id] && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${SCORE_COLORS[feedbacks[activeQ.id].score]}`}>
                      {feedbacks[activeQ.id].score}/5
                    </span>
                    <span className="text-sm text-[#474747]">
                      {feedbacks[activeQ.id].score >= 4 ? "Strong answer" : feedbacks[activeQ.id].score >= 3 ? "Decent answer" : "Needs work"}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <div className="p-4 bg-[#f0f7f4] rounded-xl">
                      <p className="text-[11px] font-mono uppercase tracking-widest text-[#1a6644] mb-1.5">What worked</p>
                      <p className="text-sm text-[#191c1c]">{feedbacks[activeQ.id].strengths}</p>
                    </div>
                    <div className="p-4 bg-[#fff8f0] rounded-xl">
                      <p className="text-[11px] font-mono uppercase tracking-widest text-[#804d00] mb-1.5">Improvements</p>
                      <p className="text-sm text-[#191c1c]">{feedbacks[activeQ.id].improvements}</p>
                    </div>
                    {feedbacks[activeQ.id].sampleAnswer && (
                      <div className="p-4 bg-[#f0f4ff] rounded-xl">
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#1a3380] mb-1.5">Strong answer structure</p>
                        <p className="text-sm text-[#191c1c]">{feedbacks[activeQ.id].sampleAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!generating && questions.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#777]">
              <p className="text-sm">No questions generated yet.</p>
              <button
                onClick={() => {
                  setQuestions([]);
                  setGenerating(true);
                  generateInterviewQuestions(app.company, app.role, app.jd || "")
                    .then((qs) => { setQuestions(qs); if (qs.length > 0) setActiveQuestion(qs[0].id); })
                    .catch(() => setError("Failed to generate questions."))
                    .finally(() => setGenerating(false));
                }}
                className="px-4 py-2 bg-black text-white text-sm rounded-xl"
              >
                Retry
              </button>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
