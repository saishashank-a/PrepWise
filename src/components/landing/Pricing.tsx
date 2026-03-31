"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const freeFeatures = [
  "Resume upload & ATS scoring",
  "AI resume tailoring (with API key)",
  "PDF & DOCX export",
  "Gap analysis",
  "Application tracker",
  "Study plan builder",
  "Code editor with execution",
  "Auto-graded test cases",
  "50+ practice problems",
];

const proFeatures = [
  "Everything in Free",
  "Advanced AI analysis",
  "Unlimited AI generations",
  "Cover letter generation",
  "LinkedIn optimization",
  "Mock interviews",
  "Priority support",
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".pricing-header", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      gsap.from(".pricing-card", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pricing-card", start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="pricing" className="relative py-32 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="pricing-header mb-16">
          <span className="text-[10px] font-mono text-white/25 tracking-[0.3em] uppercase block mb-4">
            Pricing
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Completely free.
            <br />
            <span className="text-white/30">No catch.</span>
          </h2>
          <p className="text-white/35 max-w-lg text-sm md:text-base">
            No credit card. No trial. Everything runs in your browser on
            free-tier services.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Free tier — inverted (white on black) */}
          <div className="pricing-card bg-white p-8 md:p-10">
            <div className="text-[10px] font-mono text-black/40 tracking-widest uppercase mb-6">
              Free Forever
            </div>
            <div
              className="text-6xl font-bold text-black mb-1"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              $0
              <span className="text-xl text-black/40 font-normal">/mo</span>
            </div>
            <p className="text-sm text-black/45 mb-8">
              Everything you need to land your next role
            </p>

            <ul className="space-y-3 mb-10">
              {freeFeatures.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-black/70">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0 border border-black/20 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/dashboard"
              className="block w-full py-4 text-center text-sm font-semibold bg-black text-white
                         hover:bg-black/85 transition-colors duration-200"
            >
              Get Started Free
            </a>
          </div>

          {/* Pro tier — dark card */}
          <div className="pricing-card border border-white/10 p-8 md:p-10 flex flex-col">
            <div className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-6">
              Pro — Coming Soon
            </div>
            <div
              className="text-6xl font-bold text-white/20 mb-1"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              $?
              <span className="text-xl font-normal">/mo</span>
            </div>
            <p className="text-sm text-white/20 mb-8">Advanced AI features</p>

            <ul className="space-y-3 mb-10 flex-1">
              {proFeatures.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/20">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0 border border-white/10 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full py-4 text-center text-sm font-medium border border-white/10
                         text-white/20 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
