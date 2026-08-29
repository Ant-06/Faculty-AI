# FacultyAI Hub

**Tagline:** Stay ahead of AI without spending hours learning it.

A full-stack Design Thinking prototype: an AI-powered faculty upskilling and discovery
platform for AI & Data Science Engineering faculty who need a structured, low-time-cost way
to keep up with rapidly evolving AI tools while managing teaching and administrative
(NBA/accreditation) workloads.

---

## 1. Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + React Router + Tailwind CSS + Recharts + Lucide Icons |
| Backend | Node.js + Express.js |
| Database | SQLite via Prisma ORM |
| Auth | JWT + bcrypt password hashing, role-based access (FACULTY / ADMIN) |
| AI Assistant | Rule-based mock responder — **no external AI API key required** |

Everything runs **fully locally**, with no paid services and no external AI API calls.

---

## 2. Project structure

```
faculty-ai-hub/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # ToolCard, ModuleCard, UpdateCard, Modal, Ui, ProtectedRoute
│   │   ├── pages/               # Faculty-facing pages
│   │   │   └── admin/           # Admin-facing pages
│   │   ├── layouts/             # FacultyLayout, AdminLayout (responsive sidebar/header)
│   │   ├── context/             # AuthContext (JWT session state)
│   │   ├── services/            # axios API client
│   │   ├── utils/                # icon lookup helper
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                      # Express + Prisma backend
│   ├── src/
│   │   ├── controllers/         # auth, tools, learning, misc (updates/saved/profile/announcements/analytics), assistant
│   │   ├── routes/
│   │   ├── middleware/          # auth (JWT verify + role guard), error handler
│   │   ├── services/prisma.js   # Prisma client singleton
│   │   └── server.js            # Express app entrypoint
│   ├── prisma/
│   │   ├── schema.prisma        # User, FacultyProfile, Tool, LearningModule, LearningProgress,
│   │   │                        # SavedTool, AIUpdate, Announcement
│   │   └── seed.js              # Demo data seeder
│   └── package.json
│
├── .env.example
├── package.json                 # convenience scripts to run both apps
└── README.md
```

---

## 3. Setup — exact commands

### Prerequisites
- Node.js 18+ and npm installed
- No database server needed (SQLite is a local file)

### Step 1 — Install dependencies

```bash
cd faculty-ai-hub
npm run install:all
```
This installs both `server/` and `client/` dependencies. (Equivalent to running `npm install` in each folder separately.)

### Step 2 — Configure environment variables

```bash
cp .env.example server/.env
```
The defaults work out of the box for local development. Open `server/.env` if you want to
change the JWT secret or port.

### Step 3 — Create and seed the database

```bash
npm run setup:db
```
This runs `prisma generate`, `prisma db push` (creates `server/dev.db` and all tables), and
`prisma/seed.js` (populates demo tools, learning modules, AI updates, announcements, and
demo user accounts).

> If you ever want to reset the database, delete `server/dev.db` and re-run `npm run setup:db`.

---

## 4. Run commands

From the project root, in **two terminals** (or use the combined script):

**Option A — one command (requires `concurrently`, already in root package.json):**
```bash
npm install        # installs `concurrently` at the root, only needed once
npm run dev
```

**Option B — two terminals:**
```bash
# Terminal 1
cd server
npm run dev          # API on http://localhost:4000

# Terminal 2
cd client
npm run dev           # App on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 5. Demo credentials

| Role | Email | Password |
|---|---|---|
| Faculty | `faculty@demo.com` | `Faculty@123` |
| Admin | `admin@facultyai.com` | `Admin@123` |

These are demo-only accounts seeded for local evaluation — not for production use.
Admin login is available at `/admin-login` (also linked from the landing page footer).

---

## 6. Main features

**Faculty side**
- Landing page (Problem → How it Works → Features → Institutional Access)
- Onboarding questionnaire (interest, weekly time budget, skill level) → personalizes the dashboard
- Dashboard: "You have N minutes this week" banner, weekly AI updates, recommended tools,
  10-minute learning picks, progress bar, estimated monthly time saved
- **AI Radar**: sectioned feed of what's new/trending in AI, with "why it matters" and read time
- **AI Tool Directory**: searchable/filterable (category, pricing, difficulty, sort)
- **Tool Detail**: relevance, best use cases, a 4-step learning path, "Start N-Minute Learning"
- **Quick Learning**: 5–15 minute micro-lessons with objective, content, examples, faculty-specific
  examples, a mini quiz, and a "try it yourself" sample prompt
- **My Learning**: completed/started counts, streak, total learning time, skills acquired
- **Saved Tools**: bookmarked tools grid
- **AI Faculty Assistant**: rule-based mock chat answering common faculty questions instantly,
  no external API key needed
- **Institutional Access**: pooled-access tools with a "Request Access" flow
- **Announcements** and **Profile** (editable preferences that feed recommendations)

**Admin side**
- Overview dashboard with faculty/tool/module counts and engagement chart
- Faculty list with interest/skill/time-saved columns
- AI Tools: add / edit / delete (modal forms, full validation)
- Learning Modules: add / edit / delete / publish-unpublish
- AI Updates: radar content overview
- Announcements: post / delete
- Analytics: most-saved tools, most-completed lessons, category breakdown, engagement trend
  (all via Recharts)

**Cross-cutting**
- JWT authentication, bcrypt password hashing, role-based route protection (frontend + backend)
- Responsive layout: sidebar collapses to a hamburger drawer on mobile, no horizontal scrolling
- Loading states, empty states, and inline error handling throughout
- All AI Assistant responses are local/mock — the app runs with zero external AI API keys

---

## 7. How this prototype solves the faculty member's problem

**Problem (from the interview):** AI evolves faster than a faculty member can self-learn
around a full teaching and administrative (NBA documentation) workload; premium tools are
also individually expensive.

**How each pain point maps to a feature:**

| Pain point | Feature that addresses it |
|---|---|
| AI changes too fast to track | AI Radar — curated, summarized weekly updates instead of scattered searching |
| New tools appear constantly | AI Tool Directory with faculty-specific relevance and use cases |
| Self-learning takes too much time | Quick Learning — every lesson capped at 5–15 minutes |
| Learning must fit around teaching/admin | Onboarding captures weekly time budget; Dashboard recommends only what fits it |
| No structured institutional system | The whole platform is that structure: Discover → Understand → Learn → Apply |
| Premium tools are expensive individually | Institutional AI Access — pooled access request flow |
| Students affected by outdated teaching | Faster tool adoption → more current classroom practice |
| NBA/administrative work eats into time | Dedicated "AI for Administration" learning track and tools (e.g. Microsoft Copilot for documentation) |
| Reliance on unstructured self-directed learning | Quick Learning + AI Faculty Assistant give guided, on-demand answers instead of open-ended searching |

**Outcome reinforced throughout the UI:** every screen quantifies time — "3 updates, 7
minutes," "10-Minute Learning," "you saved 4.5 hours this month" — directly answering the
faculty member's stated need for something *less time-consuming*, not just more content.

---

## 8. Notes for evaluators

- The AI Faculty Assistant uses simple keyword-matching rules (see
  `server/src/controllers/assistantController.js`) rather than a real LLM API — this keeps the
  prototype runnable offline and free, per the assignment's constraints, while still
  demonstrating the intended user experience.
- Recommendation logic is intentionally simple (interest → category match, time budget →
  module duration filter) rather than machine learning, as specified.
- The AI Updates ("AI Radar") admin page is currently read-only in the UI; the data model and
  seed pipeline support full CRUD, so add `POST`/`PUT`/`DELETE` routes on `/api/updates`
  following the same pattern as `toolsController.js` if you want that editable from the admin
  panel too.
#   F a c u l t y - A I  
 #   F a c u l t y - A I  
 