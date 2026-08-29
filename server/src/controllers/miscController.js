const prisma = require("../services/prisma");

// ---------- AI Updates (AI Radar) ----------
async function listUpdates(req, res, next) {
  try {
    const { section } = req.query;
    const where = section ? { section } : {};
    const updates = await prisma.aIUpdate.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(updates);
  } catch (err) {
    next(err);
  }
}

// ---------- Saved Tools ----------
async function listSavedTools(req, res, next) {
  try {
    const saved = await prisma.savedTool.findMany({
      where: { userId: req.user.id },
      include: { tool: true },
      orderBy: { savedAt: "desc" },
    });
    res.json(saved.map((s) => ({ ...s.tool, isSaved: true, savedAt: s.savedAt })));
  } catch (err) {
    next(err);
  }
}

async function saveTool(req, res, next) {
  try {
    const tool = await prisma.tool.findUnique({ where: { id: req.params.id } });
    if (!tool) return res.status(404).json({ error: "Tool not found." });

    const saved = await prisma.savedTool.upsert({
      where: { userId_toolId: { userId: req.user.id, toolId: tool.id } },
      update: {},
      create: { userId: req.user.id, toolId: tool.id },
    });
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

async function unsaveTool(req, res, next) {
  try {
    await prisma.savedTool.deleteMany({ where: { userId: req.user.id, toolId: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ---------- Profile ----------
async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    const { passwordHash, ...safe } = user;

    const completedCount = await prisma.learningProgress.count({ where: { userId: req.user.id, completed: true } });
    const startedCount = await prisma.learningProgress.count({ where: { userId: req.user.id } });

    res.json({ ...safe, stats: { completedCount, startedCount } });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const b = req.body;
    const profile = await prisma.facultyProfile.upsert({
      where: { userId: req.user.id },
      update: {
        department: b.department ?? undefined,
        title: b.title ?? undefined,
        primaryInterest: b.primaryInterest ?? undefined,
        weeklyTimeMinutes: b.weeklyTimeMinutes !== undefined ? Number(b.weeklyTimeMinutes) : undefined,
        skillLevel: b.skillLevel ?? undefined,
        onboardingComplete: b.onboardingComplete !== undefined ? !!b.onboardingComplete : undefined,
      },
      create: {
        userId: req.user.id,
        department: b.department || "AI & Data Science Engineering",
        title: b.title || "Assistant Professor",
        primaryInterest: b.primaryInterest || "TEACHING",
        weeklyTimeMinutes: Number(b.weeklyTimeMinutes) || 30,
        skillLevel: b.skillLevel || "BEGINNER",
        onboardingComplete: !!b.onboardingComplete,
      },
    });

    if (b.name) {
      await prisma.user.update({ where: { id: req.user.id }, data: { name: b.name } });
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
}

// ---------- Announcements ----------
async function listAnnouncements(req, res, next) {
  try {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
    res.json(announcements);
  } catch (err) {
    next(err);
  }
}

async function createAnnouncement(req, res, next) {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: "Title and body are required." });
    const announcement = await prisma.announcement.create({
      data: { title, body, authorId: req.user.id },
    });
    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
}

async function deleteAnnouncement(req, res, next) {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ---------- Admin analytics ----------
async function getAnalytics(req, res, next) {
  try {
    const [totalFaculty, activeFacultyProfiles, totalTools, totalModules, allProfiles] = await Promise.all([
      prisma.user.count({ where: { role: "FACULTY" } }),
      prisma.facultyProfile.count({ where: { totalLearningMins: { gt: 0 } } }),
      prisma.tool.count(),
      prisma.learningModule.count(),
      prisma.facultyProfile.findMany(),
    ]);

    const avgMonthlyHours =
      allProfiles.length > 0
        ? Math.round((allProfiles.reduce((s, p) => s + p.totalLearningMins, 0) / allProfiles.length / 60) * 10) / 10
        : 0;

    const tools = await prisma.tool.findMany({ include: { savedBy: true } });
    const popularTools = tools
      .map((t) => ({ id: t.id, name: t.name, saves: t.savedBy.length, popularityScore: t.popularityScore }))
      .sort((a, b) => b.saves - a.saves || b.popularityScore - a.popularityScore)
      .slice(0, 6);

    const modules = await prisma.learningModule.findMany({ include: { progress: true } });
    const popularModules = modules
      .map((m) => ({
        id: m.id,
        title: m.title,
        completions: m.progress.filter((p) => p.completed).length,
      }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 6);

    const categoryCounts = {};
    tools.forEach((t) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
    const popularCategories = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

    // Simple mock trend for engagement over the last 6 weeks
    const engagementTrend = [4.5, 5.1, 4.8, 6.2, 5.9, 7.1].map((hours, i) => ({
      week: `Week ${i + 1}`,
      hours,
    }));

    res.json({
      overview: {
        totalFaculty,
        activeFaculty: activeFacultyProfiles,
        totalTools,
        totalModules,
        avgMonthlyHours,
      },
      popularTools,
      popularModules,
      popularCategories,
      engagementTrend,
    });
  } catch (err) {
    next(err);
  }
}

// ---------- Admin faculty management ----------
async function listFaculty(req, res, next) {
  try {
    const faculty = await prisma.user.findMany({
      where: { role: "FACULTY" },
      include: { profile: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(faculty.map(({ passwordHash, ...f }) => f));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUpdates,
  listSavedTools,
  saveTool,
  unsaveTool,
  getProfile,
  updateProfile,
  listAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAnalytics,
  listFaculty,
};
