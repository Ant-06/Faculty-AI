const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
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
} = require("../controllers/miscController");

const router = express.Router();

router.get("/updates", listUpdates);

router.get("/saved-tools", requireAuth, listSavedTools);
router.post("/saved-tools/:id", requireAuth, saveTool);
router.delete("/saved-tools/:id", requireAuth, unsaveTool);

router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);

router.get("/announcements", listAnnouncements);
router.post("/announcements", requireAuth, requireRole("ADMIN"), createAnnouncement);
router.delete("/announcements/:id", requireAuth, requireRole("ADMIN"), deleteAnnouncement);

router.get("/admin/analytics", requireAuth, requireRole("ADMIN"), getAnalytics);
router.get("/admin/faculty", requireAuth, requireRole("ADMIN"), listFaculty);

module.exports = router;
