import type { Language, TestCase } from "./types";

export interface Assignment {
  id: string;
  topicTitle: string;
  title: string;
  description: string;
  starterCode: Partial<Record<Language, string>>;
  allowedLanguages: Language[];
  testCases: TestCase[];
}

function tc(id: string, input: string, expectedOutput: string, description: string): TestCase {
  return { id, input, expectedOutput, description };
}

export const ASSIGNMENTS: Assignment[] = [
  // --- Arrays & Strings ---
  {
    id: "two-sum",
    topicTitle: "Arrays & Strings",
    title: "Two Sum",
    description:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.\n\nPrint the result as a space-separated pair of indices.",
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `def two_sum(nums, target):
    # Your code here
    pass

# Read input
nums = list(map(int, input().split()))
target = int(input())
result = two_sum(nums, target)
print(result[0], result[1])`,
      javascript: `function twoSum(nums, target) {
  // Your code here
}

// Read input
const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = Number(lines[1]);
const result = twoSum(nums, target);
console.log(result[0] + ' ' + result[1]);`,
    },
    testCases: [
      tc("ts1", "2 7 11 15\n9", "0 1", "Basic case: [2,7,11,15], target=9"),
      tc("ts2", "3 2 4\n6", "1 2", "Middle elements: [3,2,4], target=6"),
      tc("ts3", "3 3\n6", "0 1", "Duplicate values: [3,3], target=6"),
    ],
  },
  {
    id: "reverse-string",
    topicTitle: "Arrays & Strings",
    title: "Reverse String",
    description:
      "Write a function that reverses a string. The input string is given as a single line.\n\nPrint the reversed string.",
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `s = input()
# Your code here
print(s[::-1])`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
// Your code here
console.log(s.split('').reverse().join(''));`,
    },
    testCases: [
      tc("rs1", "hello", "olleh", "Basic word"),
      tc("rs2", "Hannah", "hannaH", "Mixed case"),
      tc("rs3", "a", "a", "Single character"),
    ],
  },

  // --- Hash Maps & Sets ---
  {
    id: "first-unique-char",
    topicTitle: "Hash Maps & Sets",
    title: "First Unique Character",
    description:
      "Given a string, find the first non-repeating character and return its index. If it doesn't exist, return -1.\n\nPrint the index.",
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `def first_uniq_char(s):
    # Your code here
    pass

s = input()
print(first_uniq_char(s))`,
      javascript: `function firstUniqChar(s) {
  // Your code here
}

const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
console.log(firstUniqChar(s));`,
    },
    testCases: [
      tc("fu1", "leetcode", "0", "First char is unique"),
      tc("fu2", "loveleetcode", "2", "Third char 'v' is unique"),
      tc("fu3", "aabb", "-1", "No unique character"),
    ],
  },

  // --- Two Pointers ---
  {
    id: "valid-palindrome",
    topicTitle: "Two Pointers",
    title: "Valid Palindrome",
    description:
      'Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.\n\nPrint "true" or "false".',
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `def is_palindrome(s):
    # Your code here
    pass

s = input()
print("true" if is_palindrome(s) else "false")`,
      javascript: `function isPalindrome(s) {
  // Your code here
}

const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
console.log(isPalindrome(s) ? 'true' : 'false');`,
    },
    testCases: [
      tc("vp1", "A man, a plan, a canal: Panama", "true", "Classic palindrome with punctuation"),
      tc("vp2", "race a car", "false", "Not a palindrome"),
      tc("vp3", " ", "true", "Empty/whitespace is palindrome"),
    ],
  },

  // --- Binary Search ---
  {
    id: "search-insert",
    topicTitle: "Binary Search",
    title: "Search Insert Position",
    description:
      "Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be inserted.\n\nFirst line: space-separated sorted array. Second line: target value.\n\nPrint the index.",
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `def search_insert(nums, target):
    # Your code here
    pass

nums = list(map(int, input().split()))
target = int(input())
print(search_insert(nums, target))`,
      javascript: `function searchInsert(nums, target) {
  // Your code here
}

const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = lines[0].split(' ').map(Number);
const target = Number(lines[1]);
console.log(searchInsert(nums, target));`,
    },
    testCases: [
      tc("si1", "1 3 5 6\n5", "2", "Target found at index 2"),
      tc("si2", "1 3 5 6\n2", "1", "Insert between 1 and 3"),
      tc("si3", "1 3 5 6\n7", "4", "Insert at end"),
      tc("si4", "1 3 5 6\n0", "0", "Insert at beginning"),
    ],
  },

  // --- Stacks & Queues ---
  {
    id: "valid-parentheses",
    topicTitle: "Stacks & Queues",
    title: "Valid Parentheses",
    description:
      'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nPrint "true" or "false".',
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `def is_valid(s):
    # Your code here
    pass

s = input()
print("true" if is_valid(s) else "false")`,
      javascript: `function isValid(s) {
  // Your code here
}

const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
console.log(isValid(s) ? 'true' : 'false');`,
    },
    testCases: [
      tc("vp1", "()", "true", "Simple pair"),
      tc("vp2", "()[]{}", "true", "Multiple pairs"),
      tc("vp3", "(]", "false", "Mismatched"),
      tc("vp4", "([)]", "false", "Interleaved"),
    ],
  },

  // --- Linked Lists ---
  {
    id: "reverse-linked-list",
    topicTitle: "Linked Lists",
    title: "Reverse Linked List",
    description:
      "Given a space-separated list of integers representing a linked list, reverse it and print the reversed list as space-separated values.",
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `nums = list(map(int, input().split()))
# Reverse the list
nums.reverse()
print(' '.join(map(str, nums)))`,
      javascript: `const nums = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(' ').map(Number);
// Reverse the list
nums.reverse();
console.log(nums.join(' '));`,
    },
    testCases: [
      tc("rl1", "1 2 3 4 5", "5 4 3 2 1", "Five elements"),
      tc("rl2", "1 2", "2 1", "Two elements"),
      tc("rl3", "1", "1", "Single element"),
    ],
  },

  // --- Closures & Scope ---
  {
    id: "counter-function",
    topicTitle: "Closures & Scope",
    title: "Counter Function",
    description:
      "Create a function `makeCounter()` that returns a counter function. Each call to the counter should return an incrementing value starting from 0.\n\nCall the counter N times (N given as input) and print each value on a new line.",
    allowedLanguages: ["javascript"],
    starterCode: {
      javascript: `function makeCounter() {
  // Your code here
}

const n = Number(require('fs').readFileSync('/dev/stdin', 'utf8').trim());
const counter = makeCounter();
for (let i = 0; i < n; i++) {
  console.log(counter());
}`,
    },
    testCases: [
      tc("cf1", "3", "0\n1\n2", "Count to 3"),
      tc("cf2", "1", "0", "Single call"),
      tc("cf3", "5", "0\n1\n2\n3\n4", "Count to 5"),
    ],
  },

  // --- Promises & Async/Await ---
  {
    id: "fizzbuzz",
    topicTitle: "Promises & Async/Await",
    title: "FizzBuzz",
    description:
      'Print numbers from 1 to N. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".',
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `n = int(input())
for i in range(1, n + 1):
    # Your code here
    pass`,
      javascript: `const n = Number(require('fs').readFileSync('/dev/stdin', 'utf8').trim());
for (let i = 1; i <= n; i++) {
  // Your code here
}`,
    },
    testCases: [
      tc("fb1", "5", "1\n2\nFizz\n4\nBuzz", "1 to 5"),
      tc("fb2", "15", "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", "1 to 15"),
    ],
  },

  // --- SELECT & Filtering ---
  {
    id: "sql-filter-salary",
    topicTitle: "SELECT & Filtering",
    title: "Employees Above Salary",
    description:
      "Write a SQL query to find all employees with a salary greater than 50000.\n\nReturn their name and salary, ordered by salary descending.\n\nThe `employees` table has columns: id, name, department_id, salary.",
    allowedLanguages: ["sql"],
    starterCode: {
      sql: `-- Write your query here\nSELECT name, salary\nFROM employees\nWHERE salary > 50000\nORDER BY salary DESC;`,
    },
    testCases: [
      tc(
        "sf1",
        "",
        "name\tsalary\nAlice\t75000\nCharlie\t60000",
        "Employees with salary > 50000",
      ),
    ],
  },
  {
    id: "sql-filter-date",
    topicTitle: "SELECT & Filtering",
    title: "Recent Orders",
    description:
      "Write a SQL query to find all orders placed in 2024.\n\nReturn order_id and order_date, ordered by order_date.\n\nThe `orders` table has columns: order_id, customer_id, order_date, total.",
    allowedLanguages: ["sql"],
    starterCode: {
      sql: `-- Write your query here\nSELECT order_id, order_date\nFROM orders\nWHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'\nORDER BY order_date;`,
    },
    testCases: [
      tc("sd1", "", "order_id\torder_date\n3\t2024-03-10\n4\t2024-06-15", "Orders in 2024"),
    ],
  },

  // --- JOINs ---
  {
    id: "sql-join-dept",
    topicTitle: "JOINs",
    title: "Employee Department Join",
    description:
      "Write a SQL query to show each employee's name alongside their department name.\n\nUse an INNER JOIN between `employees` and `departments` tables.\n\nOrder by employee name.\n\n`employees`: id, name, department_id, salary\n`departments`: id, name",
    allowedLanguages: ["sql"],
    starterCode: {
      sql: `-- Write your query here\nSELECT e.name, d.name AS department\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id\nORDER BY e.name;`,
    },
    testCases: [
      tc(
        "jd1",
        "",
        "name\tdepartment\nAlice\tEngineering\nBob\tMarketing\nCharlie\tEngineering",
        "Employees with departments",
      ),
    ],
  },

  // --- GROUP BY & Aggregations ---
  {
    id: "sql-group-stats",
    topicTitle: "GROUP BY & Aggregations",
    title: "Department Salary Stats",
    description:
      "Write a SQL query to find the average salary per department.\n\nReturn department name and average salary (as avg_salary), ordered by avg_salary descending.\n\nJoin `employees` with `departments`.",
    allowedLanguages: ["sql"],
    starterCode: {
      sql: `-- Write your query here\nSELECT d.name AS department, AVG(e.salary) AS avg_salary\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nGROUP BY d.name\nORDER BY avg_salary DESC;`,
    },
    testCases: [
      tc(
        "gs1",
        "",
        "department\tavg_salary\nEngineering\t67500\nMarketing\t45000",
        "Average salary by department",
      ),
    ],
  },

  // --- Recursion & Backtracking ---
  {
    id: "fibonacci",
    topicTitle: "Recursion & Backtracking",
    title: "Fibonacci Number",
    description:
      "Given an integer N, print the Nth Fibonacci number.\n\nF(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).",
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `def fibonacci(n):
    # Your code here
    pass

n = int(input())
print(fibonacci(n))`,
      javascript: `function fibonacci(n) {
  // Your code here
}

const n = Number(require('fs').readFileSync('/dev/stdin', 'utf8').trim());
console.log(fibonacci(n));`,
    },
    testCases: [
      tc("fib1", "0", "0", "F(0) = 0"),
      tc("fib2", "1", "1", "F(1) = 1"),
      tc("fib3", "10", "55", "F(10) = 55"),
      tc("fib4", "20", "6765", "F(20) = 6765"),
    ],
  },

  // --- Trees & BFS/DFS ---
  {
    id: "max-depth",
    topicTitle: "Trees & BFS/DFS",
    title: "Maximum Depth (Array Tree)",
    description:
      "Given a binary tree represented as a level-order array (with -1 for null nodes), find its maximum depth.\n\nInput: space-separated integers. Print the depth.",
    allowedLanguages: ["python"],
    starterCode: {
      python: `def max_depth(tree):
    if not tree or tree[0] == -1:
        return 0
    depth = 0
    level_size = 1
    i = 0
    while i < len(tree):
        depth += 1
        next_level = 0
        for _ in range(level_size):
            if i < len(tree) and tree[i] != -1:
                next_level += 2
            i += 1
        level_size = next_level
        if level_size == 0:
            break
    return depth

tree = list(map(int, input().split()))
print(max_depth(tree))`,
    },
    testCases: [
      tc("md1", "3 9 20 -1 -1 15 7", "3", "Balanced tree, depth 3"),
      tc("md2", "1 -1 2", "2", "Right-skewed, depth 2"),
      tc("md3", "1", "1", "Single node"),
    ],
  },

  // --- Dynamic Programming ---
  {
    id: "climbing-stairs",
    topicTitle: "Dynamic Programming",
    title: "Climbing Stairs",
    description:
      "You are climbing a staircase with N steps. Each time you can climb 1 or 2 steps.\n\nHow many distinct ways can you climb to the top?\n\nPrint the number of ways.",
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      python: `def climb_stairs(n):
    # Your code here
    pass

n = int(input())
print(climb_stairs(n))`,
      javascript: `function climbStairs(n) {
  // Your code here
}

const n = Number(require('fs').readFileSync('/dev/stdin', 'utf8').trim());
console.log(climbStairs(n));`,
    },
    testCases: [
      tc("cs1", "2", "2", "2 steps: [1+1, 2]"),
      tc("cs2", "3", "3", "3 steps: [1+1+1, 1+2, 2+1]"),
      tc("cs3", "5", "8", "5 steps"),
      tc("cs4", "10", "89", "10 steps"),
    ],
  },

  // --- Graphs ---
  {
    id: "num-islands",
    topicTitle: "Graphs",
    title: "Count Connected Components",
    description:
      "Given N nodes and a list of edges, count the number of connected components.\n\nFirst line: N (number of nodes, 1-indexed). Second line: number of edges M. Next M lines: two integers u v representing an edge.\n\nPrint the number of connected components.",
    allowedLanguages: ["python"],
    starterCode: {
      python: `def count_components(n, edges):
    parent = list(range(n + 1))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
    for u, v in edges:
        union(u, v)
    return len(set(find(i) for i in range(1, n + 1)))

n = int(input())
m = int(input())
edges = []
for _ in range(m):
    u, v = map(int, input().split())
    edges.append((u, v))
print(count_components(n, edges))`,
    },
    testCases: [
      tc("cc1", "5\n3\n1 2\n2 3\n4 5", "2", "Two components: {1,2,3} and {4,5}"),
      tc("cc2", "4\n0", "4", "No edges: 4 isolated nodes"),
      tc("cc3", "3\n3\n1 2\n2 3\n1 3", "1", "Fully connected"),
    ],
  },
];

export function getAssignmentById(id: string): Assignment | undefined {
  return ASSIGNMENTS.find((a) => a.id === id);
}

export function getAssignmentsByTopic(topicTitle: string): Assignment[] {
  return ASSIGNMENTS.filter((a) => a.topicTitle === topicTitle);
}
