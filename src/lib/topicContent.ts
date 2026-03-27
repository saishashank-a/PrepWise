export interface TopicContent {
  topicTitle: string;
  theory: string;
  examples: { code: string; language: string; explanation: string }[];
}

export const TOPIC_CONTENT: TopicContent[] = [
  {
    topicTitle: "Arrays & Strings",
    theory: `## Arrays & Strings

Arrays are the most fundamental data structure — a contiguous block of memory storing elements of the same type. Strings are essentially arrays of characters.

### Key Patterns

**Two Pointers** — Use two indices moving toward or away from each other. Great for sorted arrays and palindrome checks.

**Hash Map for O(1) Lookups** — When you need to find pairs or check existence, a hash map turns O(n²) brute force into O(n).

**Sliding Window** — For subarray/substring problems with a constraint, maintain a window that expands and shrinks.

### Complexity Guide

| Operation | Array | String (immutable) |
|-----------|-------|--------------------|
| Access by index | O(1) | O(1) |
| Search | O(n) | O(n) |
| Insert/Delete at end | O(1) amortized | O(n) — new string |
| Insert/Delete at start | O(n) | O(n) |

### Tips for Interviews

- Always clarify: sorted? duplicates? negative numbers?
- Consider edge cases: empty array, single element, all same values
- If brute force is O(n²), there's almost always an O(n) solution using a hash map or two pointers`,
    examples: [
      {
        code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]`,
        language: "python",
        explanation: "Two Sum uses a hash map to store seen values. For each number, check if its complement (target - num) was already seen. O(n) time, O(n) space.",
      },
    ],
  },
  {
    topicTitle: "Binary Search",
    theory: `## Binary Search

Binary search finds an element in a **sorted** array by repeatedly halving the search space. It runs in O(log n) time.

### The Template

\`\`\`python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2  # Avoid overflow
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1  # or lo for insertion point
\`\`\`

### Variations

- **Find leftmost/rightmost occurrence** — modify the condition to continue searching after finding a match
- **Search on answer** — binary search on the result space (e.g., "what's the minimum X such that condition holds?")
- **Rotated sorted array** — determine which half is sorted, then decide which half to search

### Common Pitfalls

- Off-by-one errors: \`lo <= hi\` vs \`lo < hi\`
- Integer overflow in \`(lo + hi) / 2\` — use \`lo + (hi - lo) // 2\`
- Forgetting that the array must be sorted`,
    examples: [
      {
        code: `def search_insert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo  # Insertion point

print(search_insert([1, 3, 5, 6], 5))  # 2
print(search_insert([1, 3, 5, 6], 2))  # 1`,
        language: "python",
        explanation: "Search Insert Position returns the index where target would be inserted. When the loop ends without finding, `lo` is the correct insertion point.",
      },
    ],
  },
  {
    topicTitle: "SELECT & Filtering",
    theory: `## SQL SELECT & Filtering

The \`SELECT\` statement is the foundation of SQL. Every query starts here.

### Basic Syntax

\`\`\`sql
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1 ASC/DESC
LIMIT n;
\`\`\`

### Comparison Operators

| Operator | Meaning |
|----------|---------|
| \`=\`, \`!=\`, \`<>\` | Equal, not equal |
| \`<\`, \`>\`, \`<=\`, \`>=\` | Comparisons |
| \`BETWEEN a AND b\` | Range (inclusive) |
| \`IN (v1, v2, ...)\` | Match any in list |
| \`LIKE 'pattern'\` | Pattern match (\`%\` = any chars, \`_\` = one char) |
| \`IS NULL\`, \`IS NOT NULL\` | Null checks |

### Logical Operators

Combine conditions with \`AND\`, \`OR\`, \`NOT\`. Use parentheses to control precedence.

### Tips

- \`SELECT *\` is fine for exploration but name columns explicitly in production
- \`NULL\` comparisons need \`IS NULL\`, not \`= NULL\`
- \`ORDER BY\` defaults to \`ASC\` — specify \`DESC\` when needed
- Use \`DISTINCT\` to remove duplicates`,
    examples: [
      {
        code: `-- Find employees in Engineering earning > 60K
SELECT name, salary
FROM employees
WHERE department_id = 1
  AND salary > 60000
ORDER BY salary DESC;`,
        language: "sql",
        explanation: "Combines a WHERE clause with AND to filter on two conditions, then sorts by salary descending to show highest earners first.",
      },
    ],
  },
  {
    topicTitle: "JOINs",
    theory: `## SQL JOINs

JOINs combine rows from two or more tables based on a related column.

### JOIN Types

\`\`\`
INNER JOIN    — Only matching rows from both tables
LEFT JOIN     — All rows from left + matching from right (NULL if no match)
RIGHT JOIN    — All rows from right + matching from left
FULL JOIN     — All rows from both (NULL where no match)
CROSS JOIN    — Every combination (cartesian product)
\`\`\`

### Syntax

\`\`\`sql
SELECT e.name, d.name AS department
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
\`\`\`

### Key Concepts

- **Table aliases** (\`e\`, \`d\`) make queries readable
- **ON clause** specifies the join condition — usually a foreign key relationship
- **Multiple JOINs** can be chained: \`FROM a JOIN b ON ... JOIN c ON ...\`
- **Self JOINs** — joining a table with itself (e.g., employee → manager)

### Performance Tips

- JOINs on indexed columns are fast
- \`INNER JOIN\` is usually faster than \`LEFT JOIN\` because it can filter early
- Avoid joining on computed expressions — index won't be used`,
    examples: [
      {
        code: `-- Show each employee with their department name
SELECT e.name AS employee, d.name AS department
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY e.name;

-- LEFT JOIN to include employees without a department
SELECT e.name, COALESCE(d.name, 'No Department') AS dept
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;`,
        language: "sql",
        explanation: "INNER JOIN returns only employees with matching departments. LEFT JOIN keeps all employees and fills NULL for those without a department — COALESCE provides a fallback value.",
      },
    ],
  },
  {
    topicTitle: "Closures & Scope",
    theory: `## JavaScript Closures & Scope

A **closure** is a function that remembers its lexical scope even when executed outside of it. This is one of the most tested JavaScript concepts.

### How Closures Work

\`\`\`javascript
function outer() {
  let count = 0;        // Enclosed variable
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
counter(); // 1
counter(); // 2 — 'count' persists!
\`\`\`

The inner function "closes over" the \`count\` variable. Each call to \`outer()\` creates a new scope.

### Scope Chain

JavaScript looks up variables in this order:
1. **Local scope** (current function)
2. **Outer function scopes** (closure chain)
3. **Global scope**

### Common Interview Patterns

- **Private variables** — closures create encapsulation without classes
- **Function factories** — return configured functions
- **Memoization** — cache results using a closed-over object
- **The classic loop trap** — \`var\` in a loop shares scope; use \`let\` or IIFE

### \`var\` vs \`let\` vs \`const\`

| | \`var\` | \`let\` | \`const\` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted? | Yes (as undefined) | Yes (TDZ) | Yes (TDZ) |
| Reassign? | Yes | Yes | No |`,
    examples: [
      {
        code: `// Function factory with closure
function multiplier(factor) {
  return function(num) {
    return num * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5));  // 10
console.log(triple(5));  // 15`,
        language: "javascript",
        explanation: "multiplier() returns a new function that 'remembers' the factor value. Each call creates an independent closure with its own factor.",
      },
    ],
  },
  {
    topicTitle: "Stacks & Queues",
    theory: `## Stacks & Queues

Two fundamental linear data structures with restricted access patterns.

### Stack (LIFO — Last In, First Out)

Think of a stack of plates — you add and remove from the top.

| Operation | Time |
|-----------|------|
| push(item) | O(1) |
| pop() | O(1) |
| peek/top() | O(1) |

**Use cases:** matching brackets, undo operations, DFS, function call stack.

### Queue (FIFO — First In, First Out)

Think of a line at a store — first person in is first served.

| Operation | Time |
|-----------|------|
| enqueue(item) | O(1) |
| dequeue() | O(1) |
| front() | O(1) |

**Use cases:** BFS, task scheduling, rate limiting, message queues.

### Interview Pattern: Matching Brackets

The classic stack problem:
1. Scan left to right
2. If opening bracket, push to stack
3. If closing bracket, check if stack top matches
4. If stack is empty at the end, string is valid`,
    examples: [
      {
        code: `def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in pairs:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
    return len(stack) == 0

print(is_valid("()[]{}"))   # True
print(is_valid("([)]"))     # False
print(is_valid("{[]}"))     # True`,
        language: "python",
        explanation: "Use a stack to track opening brackets. For each closing bracket, check that the top of the stack matches. If the stack is empty at the end, all brackets are matched.",
      },
    ],
  },
  {
    topicTitle: "Dynamic Programming",
    theory: `## Dynamic Programming

DP solves problems by breaking them into overlapping subproblems and storing results to avoid redundant computation.

### When to Use DP

- Problem asks for **optimal** (min/max) or **count** of ways
- Current choice depends on results of previous choices
- Problem has **overlapping subproblems** and **optimal substructure**

### Two Approaches

**Top-Down (Memoization)** — Recursive with caching
\`\`\`python
memo = {}
def fib(n):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
\`\`\`

**Bottom-Up (Tabulation)** — Iterative, building from base cases
\`\`\`python
def fib(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

### Common DP Patterns

- **1D DP:** Climbing stairs, house robber, coin change
- **2D DP:** Longest common subsequence, edit distance, grid paths
- **Knapsack:** 0/1 knapsack, unbounded knapsack, subset sum

### Tips

- Start with brute force recursion, then add memoization
- Identify the **state** — what information do you need to make a decision?
- Look for the **recurrence relation** — how does current state relate to previous?`,
    examples: [
      {
        code: `def climb_stairs(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1

print(climb_stairs(5))   # 8
print(climb_stairs(10))  # 89`,
        language: "python",
        explanation: "Climbing Stairs is the Fibonacci pattern. At each step, you can come from (n-1) or (n-2). Space-optimized to O(1) by only keeping the last two values.",
      },
    ],
  },
  {
    topicTitle: "GROUP BY & Aggregations",
    theory: `## SQL GROUP BY & Aggregations

\`GROUP BY\` collapses rows into groups and applies aggregate functions to each group.

### Aggregate Functions

| Function | Description |
|----------|-------------|
| \`COUNT(*)\` | Number of rows |
| \`COUNT(col)\` | Non-NULL values in column |
| \`SUM(col)\` | Sum of values |
| \`AVG(col)\` | Average value |
| \`MIN(col)\` / \`MAX(col)\` | Min/max value |

### Query Order of Execution

\`\`\`
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
\`\`\`

This means:
- \`WHERE\` filters rows **before** grouping
- \`HAVING\` filters groups **after** aggregation
- You can't use aliases from \`SELECT\` in \`WHERE\`

### HAVING vs WHERE

\`\`\`sql
-- WHERE: filter individual rows
SELECT department, AVG(salary)
FROM employees
WHERE salary > 30000          -- filter before grouping
GROUP BY department;

-- HAVING: filter groups
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000;   -- filter after grouping
\`\`\``,
    examples: [
      {
        code: `-- Department statistics with HAVING filter
SELECT d.name AS department,
       COUNT(*) AS headcount,
       AVG(e.salary) AS avg_salary,
       MAX(e.salary) AS max_salary
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.name
HAVING COUNT(*) >= 2
ORDER BY avg_salary DESC;`,
        language: "sql",
        explanation: "Groups employees by department, computes stats, then filters to only departments with 2+ employees. HAVING operates on the aggregated groups, not individual rows.",
      },
    ],
  },
];

export function getTopicContent(topicTitle: string): TopicContent | undefined {
  return TOPIC_CONTENT.find((tc) => tc.topicTitle === topicTitle);
}
