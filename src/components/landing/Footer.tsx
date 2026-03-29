"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative py-20 border-t border-border-default bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Ready to <span className="gradient-text">Ace Your Interview</span>?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Start practicing now. Upload your resume, paste a job description,
            and begin your personalized preparation journey.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white
                       bg-primary hover:bg-primary/90
                       hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all duration-500"
          >
            Start Free
            <svg
              className="w-4 h-4"
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
        </motion.div>

        {/* Footer links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2">
              {["Features", "Editor", "Study Plans", "Practice"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "Blog", "Changelog", "Roadmap"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Community</h4>
            <ul className="space-y-2">
              {["GitHub", "Discord", "Twitter", "Contribute"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Cookies"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border-default">
          <div className="flex items-center gap-2.5 mb-4 md:mb-0">
            <div className="w-7 h-7 bg-white rounded-md border border-primary/20 flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-cabinet)" }}>
              Prep<span className="text-primary">Wise</span>
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Built with Next.js, Three.js, and WebAssembly. Open source &
            free forever.
          </p>
        </div>
      </div>
    </footer>
  );
}
