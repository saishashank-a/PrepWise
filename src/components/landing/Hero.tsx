"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin();

function SplitChars({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <span
            className="char"
            style={{ display: "inline-block" }}
            aria-hidden
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

const marqueeItems = [
  "ATS Scanner", "Gap Analysis", "AI Resume Tailoring",
  "Application Tracker", "Code Practice", "Mock Interviews",
  "ATS Scanner", "Gap Analysis", "AI Resume Tailoring",
  "Application Tracker", "Code Practice", "Mock Interviews",
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-topbar", { opacity: 0, duration: 1, delay: 0.1 })
        .from(".hero-badge", { opacity: 0, y: 16, duration: 0.8 }, "-=0.6")
        .from(
          ".char",
          { y: "105%", duration: 0.9, stagger: 0.022 },
          "-=0.5"
        )
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.8 }, "-=0.4")
        .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6 }, "-=0.5")
        .from(".hero-ticker", { opacity: 0, duration: 0.8 }, "-=0.3");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
    >
      {/* Noise texture */}
      <div className="noise-hero absolute inset-0 z-[1] pointer-events-none" />

      {/* Dot grid */}
      <div className="hero-dot-grid absolute inset-0 z-[1] pointer-events-none" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, #0a0a0a 100%)",
        }}
      />

      {/* Top metadata bar */}
      <div className="hero-topbar absolute top-0 left-0 right-0 z-20 pt-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <span className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase whitespace-nowrap">
            Est. 2024
          </span>
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase whitespace-nowrap">
            Job Search OS
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center mt-16">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 mb-10 border border-white/10 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
          <span className="text-[11px] font-mono text-white/40 tracking-[0.2em] uppercase">
            Your Job Search Companion
          </span>
        </div>

        {/* Headline — character split */}
        <h1
          className="text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.88] tracking-tight mb-8 select-none"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          <span className="block text-white">
            <SplitChars text="Land Your" />
          </span>
          <span className="block text-white">
            <SplitChars text="Next Role," />
          </span>
          <span className="block text-white/25">
            <SplitChars text="Faster." />
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub max-w-lg mx-auto text-white/40 text-base md:text-lg leading-relaxed mb-12">
          Build ATS-optimized resumes, track applications,
          <br />
          and prepare for every interview — free, in your browser.
        </p>

        {/* CTA row */}
        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/dashboard"
            className="group relative px-9 py-4 bg-white text-black text-sm font-semibold tracking-wide
                       hover:bg-white/90 transition-colors duration-200"
          >
            Get Started Free
            <svg
              className="inline-block ml-2.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
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
          </a>
          <a
            href="#how-it-works"
            className="px-9 py-4 border border-white/15 text-white/50 text-sm font-medium
                       hover:border-white/30 hover:text-white/80 transition-all duration-200"
          >
            See How It Works
          </a>
        </div>

        {/* Tech stack row */}
        <div className="hero-cta mt-14 flex flex-wrap justify-center gap-3">
          {["Pyodide", "PGlite", "Monaco Editor", "WebAssembly", "Next.js"].map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-[11px] font-mono text-white/20 border border-white/8"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </div>

      {/* Scroll line */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <div
          className="w-px h-14 origin-top"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </div>

      {/* Marquee ticker */}
      <div className="hero-ticker absolute bottom-0 left-0 right-0 z-10 overflow-hidden py-4 border-t border-white/[0.06]">
        <div className="marquee-track flex gap-10 text-[10px] font-mono text-white/15 uppercase tracking-[0.2em]">
          {marqueeItems.map((item, i) => (
            <span key={i} className="shrink-0">
              {item}
              <span className="ml-10 opacity-40">—</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
