const express = require("express");
const {
  createInspection,
  getMyInspections,
  cancelInspection,
  getAdminInspections,
  updateInspectionStatus,
} = require("../controllers/inspectionController");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, createInspection);
router.get("/my", protect, getMyInspections);
router.put("/:id/cancel", protect, cancelInspection);
router.get("/admin", protect, adminOnly, getAdminInspections);
router.put("/:id/status", protect, adminOnly, updateInspectionStatus);

module.exports = router;
