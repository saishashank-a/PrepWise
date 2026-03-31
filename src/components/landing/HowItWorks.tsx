"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Drop your PDF or DOCX. Our in-browser parser extracts your skills instantly and runs an ATS compatibility check — no data leaves your machine.",
    visual: (
      <div className="relative w-full h-32 rounded-xl bg-white border border-gray-200 overflow-hidden p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-medium text-foreground">resume_2024.pdf</div>
            <div className="text-[10px] text-[#777777]">245 KB</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Python", "React", "SQL", "AWS"].map((s) => (
            <span key={s} className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary border border-primary/20">
              {s}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Check Your ATS Score",
    description:
      "Paste any job description and instantly see your ATS compatibility score, missing keywords, and formatting issues. Know exactly where you stand.",
    visual: (
      <div className="relative w-full h-32 rounded-xl bg-white border border-gray-200 overflow-hidden p-4 shadow-sm">
        <div className="text-[10px] font-mono text-[#474747] leading-relaxed">
          <span className="text-foreground">Senior Software Engineer</span>
          <br />
          Requirements: Python, TypeScript,{" "}
          <span className="bg-[#f2f4f3] text-[#474747] px-0.5 rounded">Kubernetes</span>,{" "}
          <span className="bg-primary/10 text-primary px-0.5 rounded">React</span>,{" "}
          <span className="bg-[#f2f4f3] text-[#474747] px-0.5 rounded">GraphQL</span>,{" "}
          <span className="bg-primary/10 text-primary px-0.5 rounded">SQL</span>,{" "}
          <span className="bg-[#f2f4f3] text-[#474747] px-0.5 rounded">System Design</span>
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-[#777777]">
          <span className="text-primary">4</span> match &middot;{" "}
          <span className="text-[#474747]">3</span> gaps
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Tailor & Apply",
    description:
      "Generate a role-specific resume tailored to the job description. Download as PDF or DOCX and track your application status.",
    visual: (
      <div className="relative w-full h-32 rounded-xl bg-white border border-gray-200 overflow-hidden p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-foreground">AI-Tailored Resume</span>
        </div>
        <div className="space-y-1.5">
          {[
            { label: "Keyword match", pct: 92 },
            { label: "ATS score", pct: 88 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="text-[9px] text-[#474747] w-20 shrink-0">{item.label}</div>
              <div className="flex-1 h-1 rounded-full bg-[#f2f4f3] overflow-hidden">
                <div className="h-full rounded-full bg-success/60" style={{ width: `${item.pct}%` }} />
              </div>
              <span className="text-[9px] text-success">{item.pct}%</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          <span className="px-1.5 py-0.5 text-[9px] rounded bg-primary/10 text-primary border border-primary/20">PDF</span>
          <span className="px-1.5 py-0.5 text-[9px] rounded bg-[#e6e9e8] text-[#191c1c] border border-[#c6c6c6]">DOCX</span>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Prepare & Practice",
    description:
      "Build a study plan for your interviews. Practice coding, SQL, and system design — all in your browser. Show up to every interview ready.",
    visual: (
      <div className="relative w-full h-32 rounded-xl bg-white border border-gray-200 overflow-hidden p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-[10px] font-mono text-success">4/4 passed</div>
          <div className="flex-1 h-1 rounded-full bg-[#f2f4f3] overflow-hidden">
            <div className="h-full rounded-full bg-success/60 w-full" />
          </div>
        </div>
        <div className="space-y-1">
          {["Test 1: Basic case", "Test 2: Edge case", "Test 3: Large input", "Test 4: Empty"].map(
            (t) => (
              <div key={t} className="flex items-center gap-1.5 text-[10px] font-mono text-success">
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
    <section id="how-it-works" className="relative py-32 bg-[#f8faf9]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase mb-4 block">
            How It Works
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Four Steps to{" "}
            <span className="text-[#191c1c]">Your Next Role</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/20 to-transparent" />

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
                    className="text-6xl font-bold text-primary/20 mb-2 select-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-4 text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[#474747] leading-relaxed max-w-md">
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
