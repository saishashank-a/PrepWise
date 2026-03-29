"use client";

import { useEditorStore } from "@/stores/useEditorStore";
import type { Language } from "@/lib/types";

const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  sql: "SQL",
  java: "Java",
};

interface LanguageSelectorProps {
  allowedLanguages: Language[];
  onLanguageChange?: (lang: Language) => void;
}

export default function LanguageSelector({ allowedLanguages, onLanguageChange }: LanguageSelectorProps) {
  const { language, setLanguage } = useEditorStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as Language;
    setLanguage(lang);
    onLanguageChange?.(lang);
  };

  if (allowedLanguages.length === 1) {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary-light border border-primary-border">
        {LANGUAGE_LABELS[allowedLanguages[0]]}
      </span>
    );
  }

  return (
    <select
      value={language}
      onChange={handleChange}
      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-border-default
                 text-text-secondary focus:outline-none focus:border-primary-border transition-colors cursor-pointer"
    >
      {allowedLanguages.map((lang) => (
        <option key={lang} value={lang} className="bg-surface text-foreground">
          {LANGUAGE_LABELS[lang]}
        </option>
      ))}
    </select>
  );
}
