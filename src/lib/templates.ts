import type { Topic, TopicType, Difficulty } from "./types";

export interface TopicTemplate {
  title: string;
  type: TopicType;
  difficulty: Difficulty;
}

export const TOPIC_TEMPLATES: Record<string, TopicTemplate[]> = {
  "DSA Basics": [
    { title: "Arrays & Strings", type: "coding", difficulty: "easy" },
    { title: "Hash Maps & Sets", type: "coding", difficulty: "easy" },
    { title: "Two Pointers", type: "coding", difficulty: "medium" },
    { title: "Binary Search", type: "coding", difficulty: "medium" },
    { title: "Stacks & Queues", type: "coding", difficulty: "easy" },
    { title: "Linked Lists", type: "coding", difficulty: "medium" },
    { title: "Recursion & Backtracking", type: "coding", difficulty: "medium" },
    { title: "Trees & BFS/DFS", type: "coding", difficulty: "medium" },
    { title: "Dynamic Programming", type: "coding", difficulty: "hard" },
    { title: "Graphs", type: "coding", difficulty: "hard" },
  ],
  "SQL Fundamentals": [
    { title: "SELECT & Filtering", type: "sql", difficulty: "easy" },
    { title: "JOINs", type: "sql", difficulty: "medium" },
    { title: "GROUP BY & Aggregations", type: "sql", difficulty: "medium" },
    { title: "Subqueries", type: "sql", difficulty: "medium" },
    { title: "Window Functions", type: "sql", difficulty: "hard" },
    { title: "CTEs & Recursive Queries", type: "sql", difficulty: "hard" },
  ],
  "System Design 101": [
    { title: "Scalability Basics", type: "system-design", difficulty: "medium" },
    { title: "Load Balancing & Caching", type: "system-design", difficulty: "medium" },
    { title: "Database Design & Sharding", type: "system-design", difficulty: "hard" },
    { title: "Message Queues & Async", type: "system-design", difficulty: "medium" },
    { title: "API Design & REST", type: "system-design", difficulty: "easy" },
    { title: "Design a URL Shortener", type: "system-design", difficulty: "medium" },
  ],
  "JavaScript Deep Dive": [
    { title: "Closures & Scope", type: "coding", difficulty: "medium" },
    { title: "Promises & Async/Await", type: "coding", difficulty: "medium" },
    { title: "Prototypes & Classes", type: "coding", difficulty: "medium" },
    { title: "Event Loop", type: "conceptual", difficulty: "hard" },
    { title: "DOM Manipulation", type: "coding", difficulty: "easy" },
  ],
  "Behavioral Prep": [
    { title: "Tell Me About Yourself", type: "behavioral", difficulty: "easy" },
    { title: "STAR Method Practice", type: "behavioral", difficulty: "medium" },
    { title: "Conflict Resolution", type: "behavioral", difficulty: "medium" },
    { title: "Leadership & Ownership", type: "behavioral", difficulty: "medium" },
    { title: "Why This Company?", type: "behavioral", difficulty: "easy" },
  ],
};

let nextId = 1;

export function templateToTopic(template: TopicTemplate, priority: number): Topic {
  return {
    id: `topic_${Date.now()}_${nextId++}`,
    title: template.title,
    type: template.type,
    status: "not_started",
    priority,
    difficulty: template.difficulty,
  };
}
