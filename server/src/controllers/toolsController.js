const prisma = require("../services/prisma");

async function listTools(req, res, next) {
  try {
    const { category, pricing, difficulty, sort, q } = req.query;
    const where = {};
    if (category) where.category = category;
    if (pricing) where.pricing = pricing;
    if (difficulty) where.difficulty = difficulty;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
      ];
    }

    let orderBy = { popularityScore: "desc" };
    if (sort === "recent") orderBy = { createdAt: "desc" };
    if (sort === "relevant") orderBy = { popularityScore: "desc" };

    const tools = await prisma.tool.findMany({ where, orderBy });

    let savedIds = new Set();
    if (req.user) {
      const saved = await prisma.savedTool.findMany({ where: { userId: req.user.id } });
      savedIds = new Set(saved.map((s) => s.toolId));
    }

    res.json(tools.map((t) => ({ ...t, isSaved: savedIds.has(t.id) })));
  } catch (err) {
    next(err);
  }
}

async function getTool(req, res, next) {
  try {
    const tool = await prisma.tool.findUnique({ where: { id: req.params.id } });
    if (!tool) return res.status(404).json({ error: "Tool not found." });

    let isSaved = false;
    if (req.user) {
      const saved = await prisma.savedTool.findUnique({
        where: { userId_toolId: { userId: req.user.id, toolId: tool.id } },
      });
      isSaved = !!saved;
    }
    res.json({ ...tool, isSaved });
  } catch (err) {
    next(err);
  }
}

function validateToolBody(body) {
  const required = ["name", "description", "category", "pricing", "difficulty", "bestUseCase", "facultyRelevance"];
  for (const field of required) {
    if (!body[field] || !String(body[field]).trim()) {
      return `Field "${field}" is required.`;
    }
  }
  return null;
}

async function createTool(req, res, next) {
  try {
    const err = validateToolBody(req.body);
    if (err) return res.status(400).json({ error: err });

    const tool = await prisma.tool.create({
      data: {
        name: req.body.name,
        icon: req.body.icon || "Sparkles",
        description: req.body.description,
        category: req.body.category,
        pricing: req.body.pricing,
        difficulty: req.body.difficulty,
        bestUseCase: req.body.bestUseCase,
        facultyRelevance: req.body.facultyRelevance,
        learningTimeMins: Number(req.body.learningTimeMins) || 15,
        website: req.body.website || "#",
        institutional: !!req.body.institutional,
        popularityScore: Number(req.body.popularityScore) || 50,
      },
    });
    res.status(201).json(tool);
  } catch (err) {
    next(err);
  }
}

async function updateTool(req, res, next) {
  try {
    const existing = await prisma.tool.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Tool not found." });

    const tool = await prisma.tool.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name ?? existing.name,
        icon: req.body.icon ?? existing.icon,
        description: req.body.description ?? existing.description,
        category: req.body.category ?? existing.category,
        pricing: req.body.pricing ?? existing.pricing,
        difficulty: req.body.difficulty ?? existing.difficulty,
        bestUseCase: req.body.bestUseCase ?? existing.bestUseCase,
        facultyRelevance: req.body.facultyRelevance ?? existing.facultyRelevance,
        learningTimeMins: req.body.learningTimeMins !== undefined ? Number(req.body.learningTimeMins) : existing.learningTimeMins,
        website: req.body.website ?? existing.website,
        institutional: req.body.institutional !== undefined ? !!req.body.institutional : existing.institutional,
        popularityScore: req.body.popularityScore !== undefined ? Number(req.body.popularityScore) : existing.popularityScore,
      },
    });
    res.json(tool);
  } catch (err) {
    next(err);
  }
}

async function deleteTool(req, res, next) {
  try {
    const existing = await prisma.tool.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Tool not found." });
    await prisma.tool.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTools, getTool, createTool, updateTool, deleteTool };
