"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/resume-builder", label: "Resume Builder", icon: "description" },
  { href: "/plan", label: "Study Plan", icon: "menu_book" },
  { href: "/tracker", label: "App Tracker", icon: "assignment_turned_in" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-60 bg-[#f2f4f3] border-r border-black/[0.06] p-5 gap-6 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-2 pt-2">
        <Link href="/">
          <h1 className="text-lg font-black tracking-tighter text-black" style={{ fontFamily: "var(--font-display)" }}>
            PrepWise
          </h1>
        </Link>
        <p className="text-[10px] uppercase tracking-widest text-[#777] mt-0.5 font-mono">
          Career OS
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-black text-white"
                  : "text-[#474747] hover:bg-[#e6e9e8] hover:text-black"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-black/[0.06] pt-4 flex flex-col gap-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-[#777] hover:text-black transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </aside>
  );
}
