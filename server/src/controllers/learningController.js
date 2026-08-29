const prisma = require("../services/prisma");

function parseModule(mod, progress) {
  return {
    ...mod,
    examples: JSON.parse(mod.examples || "[]"),
    facultyExamples: JSON.parse(mod.facultyExamples || "[]"),
    quizOptions: JSON.parse(mod.quizOptions || "[]"),
    userProgress: progress || null,
  };
}

async function listModules(req, res, next) {
  try {
    const { category, maxDuration, difficulty } = req.query;
    const where = { published: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (maxDuration) where.durationMins = { lte: Number(maxDuration) };

    const modules = await prisma.learningModule.findMany({ where, orderBy: { createdAt: "asc" } });

    let progressMap = {};
    if (req.user) {
      const progress = await prisma.learningProgress.findMany({ where: { userId: req.user.id } });
      progressMap = Object.fromEntries(progress.map((p) => [p.moduleId, p]));
    }

    res.json(modules.map((m) => parseModule(m, progressMap[m.id])));
  } catch (err) {
    next(err);
  }
}

async function getModule(req, res, next) {
  try {
    const mod = await prisma.learningModule.findUnique({ where: { id: req.params.id } });
    if (!mod) return res.status(404).json({ error: "Learning module not found." });

    let progress = null;
    if (req.user) {
      progress = await prisma.learningProgress.findUnique({
        where: { userId_moduleId: { userId: req.user.id, moduleId: mod.id } },
      });
    }
    res.json(parseModule(mod, progress));
  } catch (err) {
    next(err);
  }
}

async function completeModule(req, res, next) {
  try {
    const mod = await prisma.learningModule.findUnique({ where: { id: req.params.id } });
    if (!mod) return res.status(404).json({ error: "Learning module not found." });

    const progress = await prisma.learningProgress.upsert({
      where: { userId_moduleId: { userId: req.user.id, moduleId: mod.id } },
      update: { completed: true, completedAt: new Date() },
      create: { userId: req.user.id, moduleId: mod.id, completed: true, completedAt: new Date() },
    });

    // Update aggregate profile stats to reinforce "time saved" narrative
    await prisma.facultyProfile.updateMany({
      where: { userId: req.user.id },
      data: {
        totalLearningMins: { increment: mod.durationMins },
        timeSavedHoursMonth: { increment: Math.round((mod.durationMins / 60) * 3 * 10) / 10 },
      },
    });

    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
}

async function createModule(req, res, next) {
  try {
    const b = req.body;
    if (!b.title || !b.description || !b.category || !b.durationMins) {
      return res.status(400).json({ error: "title, description, category, and durationMins are required." });
    }
    const mod = await prisma.learningModule.create({
      data: {
        title: b.title,
        description: b.description,
        category: b.category,
        durationMins: Number(b.durationMins),
        difficulty: b.difficulty || "Beginner",
        learningObjective: b.learningObjective || "",
        content: b.content || "",
        examples: JSON.stringify(b.examples || []),
        facultyExamples: JSON.stringify(b.facultyExamples || []),
        quizQuestion: b.quizQuestion || "",
        quizOptions: JSON.stringify(b.quizOptions || []),
        quizAnswerIndex: Number(b.quizAnswerIndex) || 0,
        samplePrompt: b.samplePrompt || "",
        published: b.published !== undefined ? !!b.published : true,
      },
    });
    res.status(201).json(parseModule(mod));
  } catch (err) {
    next(err);
  }
}

async function updateModule(req, res, next) {
  try {
    const existing = await prisma.learningModule.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Learning module not found." });
    const b = req.body;

    const mod = await prisma.learningModule.update({
      where: { id: req.params.id },
      data: {
        title: b.title ?? existing.title,
        description: b.description ?? existing.description,
        category: b.category ?? existing.category,
        durationMins: b.durationMins !== undefined ? Number(b.durationMins) : existing.durationMins,
        difficulty: b.difficulty ?? existing.difficulty,
        learningObjective: b.learningObjective ?? existing.learningObjective,
        content: b.content ?? existing.content,
        examples: b.examples ? JSON.stringify(b.examples) : existing.examples,
        facultyExamples: b.facultyExamples ? JSON.stringify(b.facultyExamples) : existing.facultyExamples,
        quizQuestion: b.quizQuestion ?? existing.quizQuestion,
        quizOptions: b.quizOptions ? JSON.stringify(b.quizOptions) : existing.quizOptions,
        quizAnswerIndex: b.quizAnswerIndex !== undefined ? Number(b.quizAnswerIndex) : existing.quizAnswerIndex,
        samplePrompt: b.samplePrompt ?? existing.samplePrompt,
        published: b.published !== undefined ? !!b.published : existing.published,
      },
    });
    res.json(parseModule(mod));
  } catch (err) {
    next(err);
  }
}

async function deleteModule(req, res, next) {
  try {
    const existing = await prisma.learningModule.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Learning module not found." });
    await prisma.learningModule.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listModules, getModule, completeModule, createModule, updateModule, deleteModule };
