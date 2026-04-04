const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'screenshots/promo');
fs.mkdirSync(OUT, { recursive: true });

const MOCK_DATA = {
  prepwise_applications: JSON.stringify([
    {
      id: "app_stripe_001",
      company: "Stripe",
      role: "Backend Engineer",
      location: "Remote",
      status: "interviewing",
      priority: "high",
      appliedDate: new Date(Date.now() - 3 * 86400000).toISOString(),
      interviewDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      interviewLink: null,
      jd: "We are looking for a Backend Engineer with experience in distributed systems, REST APIs, Go or Python, PostgreSQL, and Redis. You will build payment infrastructure that scales globally.",
      notes: "Referred by Sarah",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "app_notion_002",
      company: "Notion",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      status: "applied",
      priority: "medium",
      appliedDate: new Date(Date.now() - 7 * 86400000).toISOString(),
      interviewDate: null,
      interviewLink: null,
      jd: "Senior Software Engineer role focused on infrastructure and developer tools, TypeScript, React, Node.js",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "app_linear_003",
      company: "Linear",
      role: "Full Stack Engineer",
      location: "Remote",
      status: "to_apply",
      priority: "high",
      appliedDate: null,
      interviewDate: null,
      interviewLink: null,
      jd: "Full Stack Engineer with React, TypeScript, GraphQL and PostgreSQL experience.",
      notes: "Dream job — apply this week",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "app_figma_004",
      company: "Figma",
      role: "Software Engineer, Platform",
      location: "New York, NY",
      status: "to_apply",
      priority: "medium",
      appliedDate: null,
      interviewDate: null,
      interviewLink: null,
      jd: "",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "app_vercel_005",
      company: "Vercel",
      role: "Infrastructure Engineer",
      location: "Remote",
      status: "offer",
      priority: "high",
      appliedDate: new Date(Date.now() - 21 * 86400000).toISOString(),
      interviewDate: null,
      interviewLink: null,
      jd: "",
      notes: "Offer: $185k + equity",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]),
  prepwise_profile: JSON.stringify({
    resumeText: "John Doe — Software Engineer\n5 years building scalable web services with Python, Go, TypeScript, React, PostgreSQL, Redis, and AWS.",
    skills: [
      { name: "Python", level: "advanced" },
      { name: "TypeScript", level: "advanced" },
      { name: "React", level: "intermediate" },
      { name: "PostgreSQL", level: "intermediate" },
      { name: "Redis", level: "intermediate" },
      { name: "Go", level: "beginner" },
      { name: "AWS", level: "intermediate" },
      { name: "Docker", level: "intermediate" }
    ],
    jdSkills: [
      { name: "Go", required: true },
      { name: "Distributed Systems", required: true },
      { name: "Redis", required: true },
      { name: "PostgreSQL", required: true },
      { name: "REST APIs", required: true },
      { name: "Kubernetes", required: false }
    ]
  }),
  prepwise_plan: JSON.stringify({
    id: "plan_001",
    title: "Stripe Backend Engineer",
    jdText: "Distributed systems, Go, PostgreSQL, Redis",
    topics: [
      { id: "t1", title: "Arrays & Strings", type: "coding", difficulty: "medium", status: "completed", priority: 1 },
      { id: "t2", title: "System Design Basics", type: "system-design", difficulty: "hard", status: "in_progress", priority: 2 },
      { id: "t3", title: "Distributed Systems", type: "conceptual", difficulty: "hard", status: "not_started", priority: 3 },
      { id: "t4", title: "PostgreSQL Optimization", type: "sql", difficulty: "medium", status: "not_started", priority: 4 },
      { id: "t5", title: "Behavioral — Leadership", type: "behavioral", difficulty: "easy", status: "completed", priority: 5 }
    ]
  })
};

async function seedAndShot(page, url, filename, delay = 1500) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(delay);
  await page.screenshot({ path: path.join(OUT, filename), fullPage: true });
  console.log(`✓ ${filename}`);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Seed localStorage on first load
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.evaluate((data) => {
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(key, value);
    }
  }, MOCK_DATA);

  // 1. Landing page — full scroll
  await seedAndShot(page, 'http://localhost:3000', '01-landing.png', 2000);

  // 2. Dashboard — Resume & Skills tab (reload after seed so store picks up data)
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.evaluate((data) => { for (const [k,v] of Object.entries(data)) localStorage.setItem(k,v); }, MOCK_DATA);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '02-dashboard-skills.png'), fullPage: true });
  console.log('✓ 02-dashboard-skills.png');

  // 3. Dashboard — Gap Analysis tab
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.evaluate((data) => { for (const [k,v] of Object.entries(data)) localStorage.setItem(k,v); }, MOCK_DATA);
  await page.waitForTimeout(800);
  await page.getByText('Gap Analysis').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, '03-dashboard-gap.png'), fullPage: true });
  console.log('✓ 03-dashboard-gap.png');

  // 4. Resume Builder
  await seedAndShot(page, 'http://localhost:3000/resume-builder', '04-resume-builder.png', 800);

  // 5. Study Plan
  await page.goto('http://localhost:3000/plan', { waitUntil: 'networkidle' });
  await page.evaluate((data) => { for (const [k,v] of Object.entries(data)) localStorage.setItem(k,v); }, MOCK_DATA);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, '05-study-plan.png'), fullPage: true });
  console.log('✓ 05-study-plan.png');

  // 6. Application Tracker
  await page.goto('http://localhost:3000/tracker', { waitUntil: 'networkidle' });
  await page.evaluate((data) => { for (const [k,v] of Object.entries(data)) localStorage.setItem(k,v); }, MOCK_DATA);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '06-tracker.png'), fullPage: true });
  console.log('✓ 06-tracker.png');

  // 7. Interview Prep — seed cached questions so no API call needed
  await page.goto('http://localhost:3000/interview/app_stripe_001', { waitUntil: 'networkidle' });
  await page.evaluate((data) => { for (const [k,v] of Object.entries(data)) localStorage.setItem(k,v); }, MOCK_DATA);
  // Wait for Groq to generate questions (real API call)
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(OUT, '07-interview-questions.png'), fullPage: true });
  console.log('✓ 07-interview-questions.png');

  // 8. Practice — code editor
  await seedAndShot(page, 'http://localhost:3000/practice/two-sum', '08-practice-editor.png', 1500);

  // 9. Learn page — navigate by topic ID from plan
  await page.goto('http://localhost:3000/plan', { waitUntil: 'networkidle' });
  await page.evaluate((data) => { for (const [k,v] of Object.entries(data)) localStorage.setItem(k,v); }, MOCK_DATA);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.goto('http://localhost:3000/learn/t1', { waitUntil: 'networkidle' });
  await page.evaluate((data) => { for (const [k,v] of Object.entries(data)) localStorage.setItem(k,v); }, MOCK_DATA);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '09-learn.png'), fullPage: true });
  console.log('✓ 09-learn.png');

  await browser.close();
  console.log('\n✅ All screenshots saved to screenshots/promo/');
})();
