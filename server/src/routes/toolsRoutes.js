const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  listTools,
  getTool,
  createTool,
  updateTool,
  deleteTool,
} = require("../controllers/toolsController");

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

router.get("/", optionalAuth, listTools);
router.get("/:id", optionalAuth, getTool);
router.post("/", requireAuth, requireRole("ADMIN"), createTool);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateTool);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteTool);

module.exports = router;
