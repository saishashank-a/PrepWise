"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 2, suffix: "", prefix: "", label: "Resume Formats", description: "PDF & DOCX export" },
  { value: 0, suffix: "", prefix: "$", label: "Monthly Cost", description: "100% free, forever" },
  { value: 100, suffix: "%", prefix: "", label: "ATS Score Check", description: "Instant feedback" },
  { value: 50, suffix: "+", prefix: "", label: "Practice Problems", description: "Resume to interview" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Animate stat values with GSAP counter
      const statEls = sectionRef.current?.querySelectorAll<HTMLElement>(".stat-value");
      statEls?.forEach((el) => {
        const target = parseFloat(el.dataset.target ?? "0");
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toString();
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // Stagger entire stat blocks
      gsap.from(".stat-block", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-white/8 mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-block text-center group">
              <div
                className="text-5xl md:text-6xl font-bold text-white mb-3 tabular-nums"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                {stat.prefix}
                <span className="stat-value" data-target={stat.value}>
                  0
                </span>
                {stat.suffix}
              </div>
              <div className="text-xs font-semibold text-white/50 mb-1 tracking-wider uppercase">
                {stat.label}
              </div>
              <div className="text-xs text-white/25 font-mono">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/8 mt-16" />
      </div>
    </section>
  );
}
