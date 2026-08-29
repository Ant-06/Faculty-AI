// Rule-based mock "AI Faculty Assistant".
// No external AI API required — keeps the prototype runnable offline.

const RULES = [
  {
    keywords: ["summarize", "research paper", "literature", "papers"],
    response:
      "For summarizing research papers, try NotebookLM — upload your PDFs and it will generate grounded summaries and let you ask questions across multiple papers. Claude is also excellent for summarizing a single long paper or document. Estimated learning time: 10 minutes.",
  },
  {
    keywords: ["lecture", "lesson plan", "prepare a class", "teaching"],
    response:
      "For lesson planning, start with the 'AI-Assisted Lesson Planning' quick module (8 minutes). Give the AI your topic, session length, and student level, and ask for a structured plan with a warm-up, core content, activity, and assessment check.",
  },
  {
    keywords: ["what should i learn", "this week", "learning plan"],
    response:
      "Based on your profile, here's a 20-minute plan for this week: 1) NotebookLM basics — 7 min, 2) Prompt Engineering Essentials — 8 min, 3) AI-Assisted Lesson Planning — 5 min. You can start any of these from Quick Learning.",
  },
  {
    keywords: ["presentation", "slides", "deck"],
    response:
      "For presentations, Gamma or Canva AI both turn a text outline into a designed deck in minutes. Gamma is faster for a first draft; Canva AI gives you more visual control afterward.",
  },
  {
    keywords: ["code", "coding", "programming", "copilot"],
    response:
      "For coding support, GitHub Copilot is the strongest fit — it works inside your editor and is great for drafting reference solutions and test cases. The 'AI for Coding & Lab Work' module (15 min) shows a faculty-specific workflow.",
  },
  {
    keywords: ["admin", "nba", "accreditation", "documentation"],
    response:
      "For NBA/accreditation documentation, Microsoft Copilot inside Word/Excel is a strong fit — it can restructure raw notes and data into report-ready sections. Try the 'AI for NBA/Accreditation Documentation' module (12 min) for a faculty-specific workflow.",
  },
  {
    keywords: ["prompt", "prompting"],
    response:
      "Good prompts usually include: role, task, context, and format. Start with 'Prompt Engineering Essentials' (10 min) — it covers this structure with faculty examples like generating quiz questions.",
  },
  {
    keywords: ["free", "cheap", "budget", "expensive"],
    response:
      "For free options: NotebookLM and Perplexity are free. ChatGPT, Claude, and Gemini all have solid free tiers. Check the Institutional AI Access page too — your institution may already provide pooled access to premium tools.",
  },
  {
    keywords: ["hello", "hi", "hey"],
    response:
      "Hi! I'm your AI Faculty Assistant. Ask me things like 'What AI tool should I use to summarize research papers?' or 'Give me a 10-minute AI learning plan.'",
  },
];

const FALLBACK =
  "Here's a good starting point: check AI Radar for what's new this week, or browse AI Tools filtered by your main interest (Teaching, Research, Coding, or Administration). You can also ask me something more specific, like 'What should I learn this week?'";

function generateReply(message) {
  const lower = message.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.response;
    }
  }
  return FALLBACK;
}

async function chat(req, res, next) {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }
    // Simulate a short "thinking" delay for realism in the demo.
    await new Promise((r) => setTimeout(r, 400));
    const reply = generateReply(message);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
