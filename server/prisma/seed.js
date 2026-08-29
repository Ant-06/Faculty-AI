require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding FacultyAI Hub demo data...");

  // Clean slate (order matters for FKs)
  await prisma.learningProgress.deleteMany();
  await prisma.savedTool.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.aIUpdate.deleteMany();
  await prisma.learningModule.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.user.deleteMany();

  const facultyPasswordHash = await bcrypt.hash("Faculty@123", 10);
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);

  const facultyDemo = await prisma.user.create({
    data: {
      name: "Dr. Ananya Rao",
      email: "faculty@demo.com",
      passwordHash: facultyPasswordHash,
      role: "FACULTY",
      profile: {
        create: {
          department: "AI & Data Science Engineering",
          title: "Associate Professor",
          primaryInterest: "TEACHING",
          weeklyTimeMinutes: 30,
          skillLevel: "BEGINNER",
          onboardingComplete: true,
          streakDays: 4,
          totalLearningMins: 135,
          timeSavedHoursMonth: 4.5,
        },
      },
    },
  });

  // A few extra faculty users so admin analytics look real
  const extraFaculty = [
    { name: "Dr. Vikram Shah", email: "vikram.shah@faculty.edu", interest: "RESEARCH", skill: "INTERMEDIATE" },
    { name: "Dr. Meera Iyer", email: "meera.iyer@faculty.edu", interest: "CODING", skill: "ADVANCED" },
    { name: "Dr. Sanjay Kulkarni", email: "sanjay.kulkarni@faculty.edu", interest: "ADMINISTRATION", skill: "BEGINNER" },
    { name: "Dr. Priya Nair", email: "priya.nair@faculty.edu", interest: "CONTENT_CREATION", skill: "INTERMEDIATE" },
  ];
  for (const f of extraFaculty) {
    await prisma.user.create({
      data: {
        name: f.name,
        email: f.email,
        passwordHash: facultyPasswordHash,
        role: "FACULTY",
        profile: {
          create: {
            primaryInterest: f.interest,
            skillLevel: f.skill,
            onboardingComplete: true,
            weeklyTimeMinutes: 30,
            streakDays: Math.floor(Math.random() * 10),
            totalLearningMins: Math.floor(Math.random() * 300),
            timeSavedHoursMonth: Math.round(Math.random() * 6 * 10) / 10,
          },
        },
      },
    });
  }

  await prisma.user.create({
    data: {
      name: "Platform Admin",
      email: "admin@facultyai.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  // ---------------- Tools ----------------
  const tools = [
    {
      name: "ChatGPT",
      icon: "MessageSquare",
      description: "General-purpose conversational AI for drafting, brainstorming, explaining concepts, and quick Q&A.",
      category: "Productivity",
      pricing: "Freemium",
      difficulty: "Beginner",
      bestUseCase: "Drafting emails, generating quiz questions, brainstorming lecture ideas.",
      facultyRelevance: "High — useful across teaching, research, and admin tasks.",
      learningTimeMins: 15,
      website: "https://chat.openai.com",
      popularityScore: 98,
      institutional: true,
    },
    {
      name: "Claude",
      icon: "Sparkles",
      description: "AI assistant strong at long-document analysis, writing, and structured reasoning.",
      category: "Research",
      pricing: "Freemium",
      difficulty: "Beginner",
      bestUseCase: "Summarizing research papers, reviewing long documents, structured writing.",
      facultyRelevance: "High — excellent for literature review and academic writing support.",
      learningTimeMins: 15,
      website: "https://claude.ai",
      popularityScore: 93,
      institutional: true,
    },
    {
      name: "Gemini",
      icon: "Star",
      description: "Google's AI assistant integrated with Docs, Sheets, and Gmail for everyday academic work.",
      category: "Productivity",
      pricing: "Freemium",
      difficulty: "Beginner",
      bestUseCase: "Drafting content directly inside Google Workspace documents.",
      facultyRelevance: "Medium-High — convenient if you already use Google Workspace.",
      learningTimeMins: 12,
      website: "https://gemini.google.com",
      popularityScore: 85,
      institutional: true,
    },
    {
      name: "Perplexity",
      icon: "Search",
      description: "AI-powered answer engine that cites sources, useful for quick, sourced research.",
      category: "Research",
      pricing: "Freemium",
      difficulty: "Beginner",
      bestUseCase: "Quick literature scans with citations for background research.",
      facultyRelevance: "High — speeds up early-stage research and fact-checking.",
      learningTimeMins: 10,
      website: "https://perplexity.ai",
      popularityScore: 80,
      institutional: false,
    },
    {
      name: "NotebookLM",
      icon: "NotebookText",
      description: "Upload your own papers/notes and get grounded summaries, Q&A, and study guides from them.",
      category: "Research",
      pricing: "Free",
      difficulty: "Beginner",
      bestUseCase: "Organizing research papers and generating structured literature summaries.",
      facultyRelevance: "High — ideal for literature reviews and prepping teaching material.",
      learningTimeMins: 10,
      website: "https://notebooklm.google.com",
      popularityScore: 76,
      institutional: false,
    },
    {
      name: "Canva AI",
      icon: "Image",
      description: "AI-assisted design tool for creating slides, posters, and visual teaching material quickly.",
      category: "Content Creation",
      pricing: "Freemium",
      difficulty: "Beginner",
      bestUseCase: "Creating visually appealing lecture slides and department posters.",
      facultyRelevance: "Medium — great for presentation quality without design skills.",
      learningTimeMins: 12,
      website: "https://canva.com",
      popularityScore: 70,
      institutional: true,
    },
    {
      name: "GitHub Copilot",
      icon: "Code2",
      description: "AI pair-programmer that suggests code completions directly inside your editor.",
      category: "Coding",
      pricing: "Paid",
      difficulty: "Intermediate",
      bestUseCase: "Speeding up coding for lab assignments, sample solutions, and research scripts.",
      facultyRelevance: "High for CS/AI-DS faculty writing or reviewing code regularly.",
      learningTimeMins: 20,
      website: "https://github.com/features/copilot",
      popularityScore: 82,
      institutional: false,
    },
    {
      name: "Microsoft Copilot",
      icon: "FileText",
      description: "AI assistant integrated into Word, Excel, PowerPoint, and Outlook.",
      category: "Administration",
      pricing: "Institutional",
      difficulty: "Beginner",
      bestUseCase: "Drafting NBA documentation, formatting reports, summarizing long Word/Excel files.",
      facultyRelevance: "High — directly reduces administrative documentation time.",
      learningTimeMins: 15,
      website: "https://copilot.microsoft.com",
      popularityScore: 74,
      institutional: true,
    },
    {
      name: "Gamma",
      icon: "PresentationIcon",
      description: "Turns a text outline into a designed slide deck or one-pager in minutes.",
      category: "Presentation",
      pricing: "Freemium",
      difficulty: "Beginner",
      bestUseCase: "Converting a lecture outline into a polished, presentation-ready deck.",
      facultyRelevance: "Medium — saves significant slide-design time before class.",
      learningTimeMins: 10,
      website: "https://gamma.app",
      popularityScore: 65,
      institutional: false,
    },
    {
      name: "Julius AI",
      icon: "BarChart3",
      description: "Chat with your dataset in plain English to get charts, statistics, and insights.",
      category: "Data Analysis",
      pricing: "Freemium",
      difficulty: "Intermediate",
      bestUseCase: "Quick exploratory analysis of research or accreditation data without writing code.",
      facultyRelevance: "Medium-High for faculty handling NBA/accreditation datasets.",
      learningTimeMins: 15,
      website: "https://julius.ai",
      popularityScore: 58,
      institutional: false,
    },
  ];
  await prisma.tool.createMany({ data: tools });
  const allTools = await prisma.tool.findMany();
  const toolByName = Object.fromEntries(allTools.map((t) => [t.name, t]));

  // ---------------- Learning modules ----------------
  const modules = [
    {
      title: "AI Basics for Faculty",
      description: "A gentle 8-minute primer on what generative AI is and isn't.",
      category: "AI Basics",
      durationMins: 8,
      difficulty: "Beginner",
      learningObjective: "Understand what generative AI tools can realistically do for academic work.",
      content:
        "Generative AI tools like ChatGPT and Claude predict likely next words based on patterns learned from huge amounts of text. They are excellent at drafting, summarizing, and explaining, but can be confidently wrong, so always verify facts and citations before using their output in teaching or research materials.",
      examples: ["Drafting a course announcement", "Explaining a concept in simpler terms", "Turning bullet notes into a paragraph"],
      facultyExamples: ["Turning your rough lecture notes into a clear paragraph for students", "Drafting a polite email to a student about a deadline extension"],
      quizQuestion: "What is the most important habit when using AI-generated content?",
      quizOptions: ["Publish it immediately", "Verify facts and citations before using it", "Never use AI for anything academic", "Only use it for coding"],
      quizAnswerIndex: 1,
      samplePrompt: "Explain photosynthesis in 3 sentences suitable for a first-year engineering student.",
    },
    {
      title: "Prompt Engineering Essentials",
      description: "Learn the 4-part structure behind prompts that actually work.",
      category: "Prompt Engineering",
      durationMins: 10,
      difficulty: "Beginner",
      learningObjective: "Write clear, specific prompts that get useful results on the first try.",
      content:
        "A strong prompt usually has four parts: role (who the AI should act as), task (what you want), context (relevant details), and format (how you want the answer structured). Being specific about audience, length, and tone dramatically improves output quality.",
      examples: ["Act as a professor and summarize this abstract in 2 sentences.", "Write 5 quiz questions on binary search trees for undergraduates, with answers."],
      facultyExamples: ["Act as a teaching assistant. Create 5 multiple-choice questions on Big-O notation for second-year CS students, with the correct answer marked."],
      quizQuestion: "Which element is NOT part of a strong prompt structure?",
      quizOptions: ["Role", "Task", "Random emojis", "Format"],
      quizAnswerIndex: 2,
      samplePrompt: "Act as a professor. Write 5 exam questions on neural networks for final-year students, with answer key.",
    },
    {
      title: "AI-Assisted Lesson Planning",
      description: "Use AI to go from a topic to a structured lesson plan in minutes.",
      category: "AI for Teaching",
      durationMins: 8,
      difficulty: "Beginner",
      learningObjective: "Generate a structured, editable lesson plan draft using AI.",
      content:
        "Give the AI your topic, session duration, student level, and desired learning outcomes, and ask for a structured lesson plan with a warm-up, core content, an activity, and an assessment check. Treat the output as a first draft you refine, not a final plan.",
      examples: ["A 50-minute lesson plan on gradient descent for undergrads", "A flipped-classroom outline for a database normalization session"],
      facultyExamples: ["Create a 50-minute lesson plan on 'Introduction to Neural Networks' for third-year AI & DS students, including a 5-minute recap activity."],
      quizQuestion: "What should you always do with an AI-generated lesson plan?",
      quizOptions: ["Use it word-for-word", "Review and adapt it to your class", "Ignore it completely", "Only use it for grading"],
      quizAnswerIndex: 1,
      samplePrompt: "Create a 50-minute lesson plan on convolutional neural networks for third-year AI & Data Science students, including one hands-on activity.",
    },
    {
      title: "Using AI for Research",
      description: "Speed up literature review and paper summarization responsibly.",
      category: "AI for Research",
      durationMins: 12,
      difficulty: "Intermediate",
      learningObjective: "Use AI tools to summarize papers and organize a literature review draft.",
      content:
        "Tools like NotebookLM and Claude can summarize uploaded papers, extract key findings, and highlight research gaps. Always cross-check summaries against the original text, and never let AI fabricate citations — verify every reference manually.",
      examples: ["Summarizing a 20-page paper into 5 bullet points", "Comparing methodology across 3 papers"],
      facultyExamples: ["Upload 4 papers on transformer architectures to NotebookLM and ask it to identify common limitations mentioned across them."],
      quizQuestion: "What is a key risk when using AI to summarize research papers?",
      quizOptions: ["It's too slow", "It may fabricate citations or details", "It cannot read PDFs", "It only works in English"],
      quizAnswerIndex: 1,
      samplePrompt: "Summarize the key contributions and limitations of this paper in 5 bullet points: [paste abstract].",
    },
    {
      title: "AI for Coding & Lab Work",
      description: "Use GitHub Copilot / ChatGPT to speed up sample solutions and grading rubrics.",
      category: "AI for Coding",
      durationMins: 15,
      difficulty: "Intermediate",
      learningObjective: "Use an AI coding assistant to draft sample solutions and test cases faster.",
      content:
        "AI coding assistants are strong at generating boilerplate, sample solutions, and test cases from a clear specification, but should be reviewed for correctness and academic-integrity implications before being shared with students.",
      examples: ["Generating a reference solution for a sorting assignment", "Writing unit tests for a student lab template"],
      facultyExamples: ["Ask Copilot to draft a Python reference solution and 3 edge-case test inputs for a linked-list reversal lab."],
      quizQuestion: "Before sharing AI-generated code with students, faculty should:",
      quizOptions: ["Share it immediately", "Review it for correctness and originality", "Delete it", "Only use it for grading"],
      quizAnswerIndex: 1,
      samplePrompt: "Write a Python reference solution and 3 edge-case tests for reversing a singly linked list.",
    },
    {
      title: "AI for Productivity",
      description: "Automate repetitive admin writing tasks with AI.",
      category: "AI for Productivity",
      durationMins: 7,
      difficulty: "Beginner",
      learningObjective: "Use AI to draft routine emails, meeting notes, and schedules faster.",
      content:
        "Routine writing — meeting minutes, reminder emails, agenda drafts — is one of the fastest wins for AI. Paste rough notes and ask for a clean, formatted version in your preferred tone.",
      examples: ["Turning meeting notes into action items", "Drafting a reminder email to a committee"],
      facultyExamples: ["Paste rough department meeting notes and ask AI to produce a clean summary with action items and owners."],
      quizQuestion: "Which task is the best 'quick win' for AI productivity use?",
      quizOptions: ["Grading final exams alone", "Drafting routine emails and meeting summaries", "Making final admission decisions", "Replacing faculty judgment"],
      quizAnswerIndex: 1,
      samplePrompt: "Turn these rough meeting notes into a clean summary with action items and owners: [paste notes].",
    },
    {
      title: "AI for NBA/Accreditation Documentation",
      description: "Use AI to structure and format accreditation documentation faster.",
      category: "AI for Administration",
      durationMins: 12,
      difficulty: "Intermediate",
      learningObjective: "Use AI to draft structured sections of accreditation reports from raw notes.",
      content:
        "Accreditation documentation often needs restructuring raw data into required formats. AI can draft section text from bullet data (e.g., course outcomes, attainment tables) which you then verify against actual records before submission.",
      examples: ["Drafting a Course Outcome attainment narrative from raw scores", "Formatting a program report section"],
      facultyExamples: ["Paste raw CO-PO attainment numbers and ask AI to draft the narrative paragraph required for NBA Criterion 3."],
      quizQuestion: "AI-drafted accreditation text should always be:",
      quizOptions: ["Submitted as-is", "Verified against actual institutional data", "Ignored", "Written only by students"],
      quizAnswerIndex: 1,
      samplePrompt: "Draft a narrative paragraph for an NBA report summarizing this CO-PO attainment data: [paste data].",
    },
    {
      title: "Advanced Prompt Patterns",
      description: "Chain-of-thought, few-shot examples, and iterative refinement.",
      category: "Prompt Engineering",
      durationMins: 14,
      difficulty: "Advanced",
      learningObjective: "Use advanced prompting patterns to get more reliable, structured outputs.",
      content:
        "Few-shot prompting (giving 1-2 examples of the format you want) and asking the AI to 'think step by step' before answering often improves accuracy on reasoning-heavy tasks like generating graded rubrics or exam questions with difficulty levels.",
      examples: ["Few-shot example for consistent quiz formatting", "Step-by-step reasoning before final answer"],
      facultyExamples: ["Provide 2 example quiz questions in your exact format, then ask AI to generate 8 more in the same style."],
      quizQuestion: "Few-shot prompting means:",
      quizOptions: ["Asking very short questions", "Giving example outputs to guide format", "Using 5 different AI tools", "Avoiding all context"],
      quizAnswerIndex: 1,
      samplePrompt: "Here are 2 example quiz questions in my format: [examples]. Generate 8 more in the exact same style on Big-O notation.",
    },
    {
      title: "Choosing the Right AI Tool",
      description: "A quick framework for picking a tool instead of trying everything.",
      category: "AI Basics",
      durationMins: 6,
      difficulty: "Beginner",
      learningObjective: "Use a simple decision framework to pick the right AI tool for a task.",
      content:
        "Ask three questions: (1) What's the task — writing, research, coding, design, or data? (2) How much time do I have? (3) Do I need it to work with my own documents? These answers usually narrow the choice to 1-2 tools instead of a dozen.",
      examples: ["Research + own PDFs → NotebookLM", "Quick sourced answer → Perplexity", "Slide design → Gamma or Canva AI"],
      facultyExamples: ["For summarizing your own thesis drafts before a meeting, NotebookLM beats a general chatbot because it stays grounded in your uploaded file."],
      quizQuestion: "If you need answers grounded in your own uploaded papers, the best fit is usually:",
      quizOptions: ["A general chatbot with no uploads", "NotebookLM", "A presentation tool", "A coding assistant"],
      quizAnswerIndex: 1,
      samplePrompt: "I have 3 research PDFs. Which tool should I use to get a grounded summary, and why?",
    },
    {
      title: "AI for Presentations in 10 Minutes",
      description: "Turn a rough outline into a designed deck fast.",
      category: "AI for Teaching",
      durationMins: 10,
      difficulty: "Beginner",
      learningObjective: "Generate a first-draft slide deck from a text outline using AI design tools.",
      content:
        "Tools like Gamma and Canva AI can turn a bulleted outline into a styled slide deck in minutes. Provide section headers and key points; let the tool handle layout and imagery, then adjust colors/branding to match your institution.",
      examples: ["10-slide outline → designed deck in under 5 minutes", "Auto-generated diagrams from bullet points"],
      facultyExamples: ["Paste your 8-point lecture outline on 'Intro to Data Ethics' into Gamma to get a first-draft deck before refining it yourself."],
      quizQuestion: "What should you provide to get a good first-draft deck?",
      quizOptions: ["Nothing, just a topic word", "A clear outline with section headers and key points", "The entire textbook", "Only images"],
      quizAnswerIndex: 1,
      samplePrompt: "Turn this 8-point outline on 'Introduction to Data Ethics' into a slide deck outline with speaker notes.",
    },
  ];
  await prisma.learningModule.createMany({
    data: modules.map((m) => ({
      ...m,
      examples: JSON.stringify(m.examples),
      facultyExamples: JSON.stringify(m.facultyExamples),
      quizOptions: JSON.stringify(m.quizOptions),
    })),
  });
  const allModules = await prisma.learningModule.findMany();

  // Give the demo faculty some progress
  const completedTitles = ["AI Basics for Faculty", "Prompt Engineering Essentials", "AI-Assisted Lesson Planning"];
  for (const mod of allModules) {
    if (completedTitles.includes(mod.title)) {
      await prisma.learningProgress.create({
        data: { userId: facultyDemo.id, moduleId: mod.id, completed: true, completedAt: new Date() },
      });
    }
  }
  // one in-progress
  const inProgress = allModules.find((m) => m.title === "Using AI for Research");
  if (inProgress) {
    await prisma.learningProgress.create({ data: { userId: facultyDemo.id, moduleId: inProgress.id, completed: false } });
  }

  // Saved tools for demo faculty
  for (const name of ["Claude", "NotebookLM", "Microsoft Copilot"]) {
    await prisma.savedTool.create({ data: { userId: facultyDemo.id, toolId: toolByName[name].id } });
  }

  // ---------------- AI Updates ----------------
  const updates = [
    {
      title: "NotebookLM adds new research workflow features",
      category: "Research",
      summary: "NotebookLM can now organize multiple research papers and generate structured summaries and study guides automatically.",
      whyItMatters: "Useful for literature reviews and preparing teaching material without reading every paper end-to-end.",
      readTimeMins: 3,
      relevanceScore: 92,
      section: "New This Week",
    },
    {
      title: "GitHub Copilot improves code explanation mode",
      category: "Coding",
      summary: "Copilot's chat can now explain unfamiliar code line-by-line, useful when reviewing student submissions quickly.",
      whyItMatters: "Cuts down time spent manually tracing through unfamiliar student code during grading.",
      readTimeMins: 2,
      relevanceScore: 78,
      section: "New This Week",
    },
    {
      title: "Canva AI adds classroom-ready templates",
      category: "Content Creation",
      summary: "New academic template packs make it faster to build lecture slides and department posters.",
      whyItMatters: "Reduces design time before class without needing design skills.",
      readTimeMins: 2,
      relevanceScore: 65,
      section: "New This Week",
    },
    {
      title: "Perplexity is trending among research faculty",
      category: "Research",
      summary: "Faculty are increasingly using Perplexity for quick, source-cited answers during early-stage literature scans.",
      whyItMatters: "A fast way to sanity-check facts and find sources before deep reading.",
      readTimeMins: 3,
      relevanceScore: 74,
      section: "Trending AI Tools",
    },
    {
      title: "Prompt engineering is becoming a core faculty skill",
      category: "AI Basics",
      summary: "Institutions are increasingly expecting faculty to know basic prompt structuring, not just tool names.",
      whyItMatters: "A 10-minute investment in prompt basics improves results across every AI tool you already use.",
      readTimeMins: 3,
      relevanceScore: 88,
      section: "Trending AI Tools",
    },
    {
      title: "Using AI to build rubric-aligned quiz banks",
      category: "Teaching",
      summary: "Faculty are using structured prompts to generate quiz question banks aligned to course outcomes.",
      whyItMatters: "Saves hours per week on question-bank preparation for continuous assessment.",
      readTimeMins: 4,
      relevanceScore: 81,
      section: "AI for Teaching",
    },
    {
      title: "AI-assisted literature gap analysis",
      category: "Research",
      summary: "New workflows use AI to compare multiple papers and flag under-explored research gaps.",
      whyItMatters: "Speeds up identifying a viable research angle for papers and proposals.",
      readTimeMins: 4,
      relevanceScore: 79,
      section: "AI for Research",
    },
    {
      title: "Microsoft Copilot now drafts accreditation-style reports",
      category: "Administration",
      summary: "Copilot in Word can restructure raw notes into formatted report sections suitable for accreditation documentation.",
      whyItMatters: "Directly reduces time spent on NBA and administrative documentation.",
      readTimeMins: 3,
      relevanceScore: 85,
      section: "AI for Administration",
    },
  ];
  await prisma.aIUpdate.createMany({ data: updates });

  // ---------------- Announcements ----------------
  const announcements = [
    { title: "New AI tools added this week", body: "We've added Julius AI and Gamma to the AI Tool Directory — check them out under Data Analysis and Presentation categories." },
    { title: "Faculty AI workshop on Friday", body: "Join the 45-minute hands-on workshop on prompt engineering for lesson planning, Friday 3 PM, Seminar Hall 2." },
    { title: "New institutional access available", body: "Pooled institutional access to Microsoft Copilot is now live for all AI & DS faculty — request access from the Institutional AI Access page." },
    { title: "NBA documentation AI support session", body: "A short session on using AI to draft NBA Criterion 3 narratives will be held next Tuesday." },
    { title: "Quick Learning library expanded", body: "5 new micro-learning modules have been added, including 'Advanced Prompt Patterns' and 'AI for NBA Documentation'." },
  ];
  await prisma.announcement.createMany({ data: announcements });

  console.log("Seed complete.");
  console.log("Faculty demo login: faculty@demo.com / Faculty@123");
  console.log("Admin demo login:   admin@facultyai.com / Admin@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
