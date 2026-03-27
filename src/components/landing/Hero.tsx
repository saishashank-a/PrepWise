"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* WebGL Background */}
      <ParticleField />

      {/* Radial gradient overlays */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-glow/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow animate-pulse-glow" />
          <span className="text-xs font-medium text-text-muted tracking-wide uppercase">
            Free & Open Source
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          <span className="block">Ace Your Next</span>
          <span className="block gradient-text glow-text">
            Technical Interview
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-text-muted leading-relaxed mb-10"
        >
          Upload your resume. Paste the job description. Get a personalized
          study plan with in-browser coding practice.{" "}
          <span className="text-foreground/70">
            Python, SQL, JavaScript, Java
          </span>{" "}
          — all running in your browser.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="/dashboard"
            className="group relative px-8 py-4 rounded-xl font-semibold text-background
                       bg-gradient-to-r from-emerald-glow to-emerald-mid
                       hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] transition-all duration-500"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Preparing
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </a>
          <a
            href="#editor"
            className="px-8 py-4 rounded-xl font-medium text-text-muted
                       border border-border-subtle hover:border-border-glow
                       hover:text-foreground transition-all duration-300"
          >
            See the Editor
          </a>
        </motion.div>

        {/* Tech stack pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {[
            "Pyodide (Python)",
            "PGlite (PostgreSQL)",
            "Monaco Editor",
            "WebAssembly",
            "Next.js",
            "Firebase",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-mono text-text-dim border border-border-subtle rounded-md"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-text-dim/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-emerald-glow/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
