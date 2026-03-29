"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 4,
    suffix: "",
    label: "Languages",
    description: "Python, JS, SQL, Java",
    prefix: "",
  },
  {
    value: 0,
    suffix: "",
    label: "Monthly Cost",
    description: "100% free, forever",
    prefix: "$",
  },
  {
    value: 100,
    suffix: "%",
    label: "In-Browser",
    description: "No server needed",
    prefix: "",
  },
  {
    value: 50,
    suffix: "+",
    label: "Practice Problems",
    description: "With auto-grading",
    prefix: "",
  },
];

export default function Stats() {
  return (
    <section className="relative py-24 bg-slate-50">
      {/* Top line */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center group"
            >
              <div
                className="text-4xl md:text-5xl font-bold gradient-text mb-2"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <div className="text-sm font-semibold text-slate-800 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-16" />
      </div>
    </section>
  );
}
