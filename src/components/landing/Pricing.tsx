"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase mb-4 block">
            Pricing
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Completely <span className="text-[#191c1c]">Free</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#474747] text-lg">
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
            <div className="rounded-2xl p-8 bg-white border-2 border-primary/30 shadow-md">
              <div className="text-sm text-primary font-mono mb-4">
                Free Forever
              </div>
              <div
                className="text-5xl font-bold mb-1 text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $0
                <span className="text-lg text-[#474747] font-normal">/mo</span>
              </div>
              <p className="text-sm text-[#474747] mb-8">
                Everything you need to land your next role
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Resume upload & ATS scoring",
                  "AI resume tailoring (with API key)",
                  "PDF & DOCX export",
                  "Gap analysis",
                  "Application tracker",
                  "Study plan builder",
                  "Code editor with execution",
                  "Auto-graded test cases",
                  "50+ practice problems",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#191c1c]">
                    <svg
                      className="w-4 h-4 text-success flex-shrink-0"
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
                className="block w-full py-3 rounded-xl text-center font-semibold text-white
                           bg-primary hover:bg-primary/90
                           transition-all duration-500"
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
            <div className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm">
              <div className="text-sm text-[#777777] font-mono mb-4">
                Pro (Coming Soon)
              </div>
              <div
                className="text-5xl font-bold text-[#777777] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $?
                <span className="text-lg font-normal">/mo</span>
              </div>
              <p className="text-sm text-[#777777] mb-8">Advanced AI features</p>

              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "Advanced AI analysis",
                  "Unlimited AI generations",
                  "Cover letter generation",
                  "LinkedIn optimization",
                  "Mock interviews",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#777777]">
                    <svg
                      className="w-4 h-4 text-[#c6c6c6] flex-shrink-0"
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
                className="block w-full py-3 rounded-xl text-center font-medium text-[#777777]
                           border border-gray-200 cursor-not-allowed bg-[#f8faf9]"
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
