const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  listModules,
  getModule,
  completeModule,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/learningController");

const router = express.Router();

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  try {
    const jwt = require("jsonwebtoken");
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {}
  next();
}

router.get("/", optionalAuth, listModules);
router.get("/:id", optionalAuth, getModule);
router.post("/:id/complete", requireAuth, completeModule);
router.post("/", requireAuth, requireRole("ADMIN"), createModule);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateModule);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteModule);

module.exports = router;
