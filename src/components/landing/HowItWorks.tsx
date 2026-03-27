"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Drop your PDF or DOCX. Our in-browser parser extracts the text instantly. Tag your skills with proficiency levels.",
    visual: (
      <div className="relative w-full h-32 rounded-xl bg-surface-elevated border border-border-subtle overflow-hidden p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-glow/10 border border-emerald-glow/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-medium text-foreground/80">resume_2024.pdf</div>
            <div className="text-[10px] text-text-dim">245 KB</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Python", "React", "SQL", "AWS"].map((s) => (
            <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20">
              {s}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Paste the Job Description",
    description:
      "Copy any job posting. We'll help you identify the required skills and compare them against your resume.",
    visual: (
      <div className="relative w-full h-32 rounded-xl bg-surface-elevated border border-border-subtle overflow-hidden p-4">
        <div className="text-[10px] font-mono text-text-dim leading-relaxed">
          <span className="text-foreground/60">Senior Software Engineer</span>
          <br />
          Requirements: Python, TypeScript,{" "}
          <span className="bg-red-500/10 text-red-400 px-0.5 rounded">Kubernetes</span>,{" "}
          <span className="bg-emerald-glow/10 text-emerald-glow px-0.5 rounded">React</span>,{" "}
          <span className="bg-red-500/10 text-red-400 px-0.5 rounded">GraphQL</span>,{" "}
          <span className="bg-emerald-glow/10 text-emerald-glow px-0.5 rounded">SQL</span>,{" "}
          <span className="bg-red-500/10 text-red-400 px-0.5 rounded">System Design</span>
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-text-dim">
          <span className="text-emerald-glow">4</span> match &middot;{" "}
          <span className="text-red-400">3</span> gaps
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Build Your Study Plan",
    description:
      "Create a prioritized learning path. Pick from templates or build your own. Track progress as you go.",
    visual: (
      <div className="relative w-full h-32 rounded-xl bg-surface-elevated border border-border-subtle overflow-hidden p-4">
        <div className="space-y-2">
          {[
            { topic: "System Design", status: "In Progress", pct: 40 },
            { topic: "Kubernetes Basics", status: "Not Started", pct: 0 },
            { topic: "GraphQL", status: "Not Started", pct: 0 },
          ].map((item) => (
            <div key={item.topic} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-[10px] text-foreground/70 mb-0.5">{item.topic}</div>
                <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-glow/60"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
              <span className="text-[9px] text-text-dim whitespace-nowrap">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Practice & Verify",
    description:
      "Solve problems in the code editor. Run your code, check test cases, and build real confidence.",
    visual: (
      <div className="relative w-full h-32 rounded-xl bg-surface-elevated border border-border-subtle overflow-hidden p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-[10px] font-mono text-emerald-glow">4/4 passed</div>
          <div className="flex-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div className="h-full rounded-full bg-emerald-glow/60 w-full" />
          </div>
        </div>
        <div className="space-y-1">
          {["Test 1: Basic case", "Test 2: Edge case", "Test 3: Large input", "Test 4: Empty"].map(
            (t) => (
              <div key={t} className="flex items-center gap-1.5 text-[10px] font-mono text-[#98c379]">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </div>
            )
          )}
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-emerald-glow tracking-widest uppercase mb-4 block">
            How It Works
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Four Steps to{" "}
            <span className="gradient-text">Interview Ready</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-glow/20 via-emerald-glow/10 to-transparent" />

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text */}
                <div className="flex-1 text-center lg:text-left">
                  <div
                    className="text-6xl font-bold text-emerald-glow/10 mb-2"
                    style={{ fontFamily: "var(--font-cabinet)" }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-cabinet)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>

                {/* Visual */}
                <div className="flex-1 w-full max-w-md">{step.visual}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
