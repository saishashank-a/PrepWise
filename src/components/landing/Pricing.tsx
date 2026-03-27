"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-emerald-glow tracking-widest uppercase mb-4 block">
            Pricing
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Completely <span className="gradient-text">Free</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-muted text-lg">
            No credit card. No trial. No catch. Everything runs in your browser
            on free-tier services.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="animated-border rounded-2xl p-8">
              <div className="text-sm text-emerald-glow font-mono mb-4">
                Free Forever
              </div>
              <div
                className="text-5xl font-bold mb-1"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                $0
                <span className="text-lg text-text-dim font-normal">/mo</span>
              </div>
              <p className="text-sm text-text-muted mb-8">
                Everything you need to prepare
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Resume upload & parsing",
                  "Job description analysis",
                  "Gap analysis view",
                  "Study plan builder",
                  "Monaco code editor",
                  "Python, JS, SQL execution",
                  "Java via JDoodle (200/day)",
                  "Auto-graded test cases",
                  "Progress tracking",
                  "50+ practice problems",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                    <svg
                      className="w-4 h-4 text-emerald-glow flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="/dashboard"
                className="block w-full py-3 rounded-xl text-center font-semibold text-background
                           bg-gradient-to-r from-emerald-glow to-emerald-mid
                           hover:shadow-[0_0_30px_rgba(0,255,136,0.25)] transition-all duration-500"
              >
                Get Started Free
              </a>
            </div>
          </motion.div>

          {/* Pro tier (future) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-2xl p-8 bg-surface-elevated border border-border-subtle">
              <div className="text-sm text-text-dim font-mono mb-4">
                Pro (Coming Soon)
              </div>
              <div
                className="text-5xl font-bold text-text-dim mb-1"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                $?
                <span className="text-lg font-normal">/mo</span>
              </div>
              <p className="text-sm text-text-dim mb-8">AI-powered features</p>

              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "AI resume analysis",
                  "AI gap detection",
                  "AI-generated study plans",
                  "AI code evaluation",
                  "Re-explanation on failure",
                  "Behavioral prep",
                  "System design practice",
                  "Mock interview mode",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-dim">
                    <svg
                      className="w-4 h-4 text-text-dim/50 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="block w-full py-3 rounded-xl text-center font-medium text-text-dim
                           border border-border-subtle cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
