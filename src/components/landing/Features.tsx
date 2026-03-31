"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
    title: "ATS Resume Scanner",
    description:
      "Check your resume's ATS compatibility score instantly. Get keyword match analysis, formatting feedback, and actionable improvements — all in your browser.",
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    borderColor: "border-blue-100",
    hoverGlow: "bg-primary/[0.04]",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
      </svg>
    ),
    title: "Gap Analysis",
    description:
      "See exactly which skills you're missing for a role. Compare your resume against any job description instantly and know where to focus.",
    iconBg: "bg-emerald-50",
    iconColor: "text-success",
    borderColor: "border-emerald-100",
    hoverGlow: "bg-success/[0.04]",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="m9 9.5 2 2 4-4" />
      </svg>
    ),
    title: "AI Resume Tailoring",
    description:
      "Generate role-specific resumes tailored to each job description. Edit section-by-section or get a complete rewrite. Export as PDF or DOCX.",
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    borderColor: "border-blue-100",
    hoverGlow: "bg-primary/[0.04]",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" opacity="0.3" />
      </svg>
    ),
    title: "Application Tracker",
    description:
      "Track every application in a Kanban board. Monitor statuses from applied to offered. Never lose track of where you stand. (Coming Soon)",
    iconBg: "bg-emerald-50",
    iconColor: "text-success",
    borderColor: "border-emerald-100",
    hoverGlow: "bg-success/[0.04]",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "In-Browser Code Practice",
    description:
      "Full code editor with Python, SQL, and JavaScript execution. No setup needed — write code, run it, get instant feedback right in your browser.",
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    borderColor: "border-blue-100",
    hoverGlow: "bg-primary/[0.04]",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>
    ),
    title: "AI-Powered Prep",
    description:
      "Get AI feedback on your code, generate personalized study plans, and practice with an AI interview coach. Bring your own API key.",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    borderColor: "border-rose-100",
    hoverGlow: "bg-rose-50/50",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden bg-white">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20 overflow-hidden" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase mb-4 block">
            Features
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything You Need to{" "}
            <span className="gradient-text">Get Hired</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 text-lg">
            From ATS-optimized resumes to in-browser interview practice — a
            complete job search workflow that runs entirely in your browser.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group relative"
            >
              <div
                className="relative h-full p-7 rounded-2xl bg-white
                           border border-gray-200 hover:border-primary/30
                           shadow-sm hover:shadow-md
                           transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className={`absolute -top-20 -right-20 w-40 h-40 ${feature.hoverGlow} rounded-full blur-3xl
                              opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${feature.iconBg}
                              flex items-center justify-center ${feature.iconColor} mb-5
                              border ${feature.borderColor}`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
