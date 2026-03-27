"use client";

import { useState } from "react";
import { usePlanStore } from "@/stores/usePlanStore";
import { TOPIC_TEMPLATES, templateToTopic } from "@/lib/templates";
import type { TopicType, Difficulty } from "@/lib/types";
import TopicCard from "./TopicCard";
import ProgressBar from "./ProgressBar";

export default function PlanBuilder() {
  const {
    plan,
    createPlan,
    addTopic,
    removeTopic,
    updateTopicStatus,
    moveTopic,
    getCompletionPercentage,
  } = usePlanStore();

  const [showTemplates, setShowTemplates] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customType, setCustomType] = useState<TopicType>("coding");
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>("medium");

  // Create plan if none exists
  if (!plan) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-8 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-glow/10 border border-emerald-glow/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground/80">No study plan yet</h3>
          <p className="text-xs text-text-dim mt-1">Create a plan to organize your interview preparation</p>
        </div>
        <button
          onClick={() => createPlan("Interview Prep")}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-glow/10 text-emerald-glow
                     border border-emerald-glow/20 hover:bg-emerald-glow/15 transition-colors"
        >
          Create Study Plan
        </button>
      </div>
    );
  }

  const completed = plan.topics.filter((t) => t.status === "completed").length;
  const percentage = getCompletionPercentage();

  const handleAddCustom = () => {
    const title = customTitle.trim();
    if (!title) return;
    const topic = templateToTopic(
      { title, type: customType, difficulty: customDifficulty },
      plan.topics.length + 1,
    );
    addTopic(topic);
    setCustomTitle("");
  };

  const handleAddTemplate = (templateName: string) => {
    const templates = TOPIC_TEMPLATES[templateName];
    if (!templates) return;
    const startPriority = plan.topics.length + 1;
    templates.forEach((t, i) => {
      addTopic(templateToTopic(t, startPriority + i));
    });
    setShowTemplates(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      {plan.topics.length > 0 && (
        <ProgressBar percentage={percentage} total={plan.topics.length} completed={completed} />
      )}

      {/* Add topic */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            placeholder="Add a topic (e.g. Binary Search, SQL JOINs)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle
                       text-sm text-foreground placeholder:text-text-dim
                       focus:outline-none focus:border-emerald-glow/30 transition-colors"
          />
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value as TopicType)}
            className="px-3 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle
                       text-xs text-text-muted focus:outline-none focus:border-emerald-glow/30 transition-colors"
          >
            <option value="coding">Coding</option>
            <option value="sql">SQL</option>
            <option value="conceptual">Conceptual</option>
            <option value="system-design">System Design</option>
            <option value="behavioral">Behavioral</option>
          </select>
          <select
            value={customDifficulty}
            onChange={(e) => setCustomDifficulty(e.target.value as Difficulty)}
            className="px-3 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle
                       text-xs text-text-muted focus:outline-none focus:border-emerald-glow/30 transition-colors"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={handleAddCustom}
            disabled={!customTitle.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-glow/10 text-emerald-glow
                       border border-emerald-glow/20 hover:bg-emerald-glow/15 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-xs text-cyan-glow hover:text-cyan-glow/80 transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {showTemplates ? "Hide templates" : "Add from templates"}
        </button>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(TOPIC_TEMPLATES).map(([name, topics]) => (
            <button
              key={name}
              onClick={() => handleAddTemplate(name)}
              className="p-3 rounded-xl border border-border-subtle bg-surface-elevated/50
                         hover:border-cyan-glow/20 hover:bg-cyan-glow/[0.03] transition-all text-left"
            >
              <div className="text-sm font-medium text-foreground/80">{name}</div>
              <div className="text-[10px] text-text-dim mt-1">{topics.length} topics</div>
            </button>
          ))}
        </div>
      )}

      {/* Topic list */}
      {plan.topics.length > 0 ? (
        <div className="space-y-2">
          {plan.topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={index}
              total={plan.topics.length}
              onStatusChange={(status) => updateTopicStatus(topic.id, status)}
              onMoveUp={() => moveTopic(topic.id, "up")}
              onMoveDown={() => moveTopic(topic.id, "down")}
              onRemove={() => removeTopic(topic.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border-subtle p-8 text-center">
          <p className="text-sm text-text-dim">
            Add topics manually or pick from templates above to build your study plan.
          </p>
        </div>
      )}
    </div>
  );
}
