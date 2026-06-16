const express = require("express");
const {
  createTestDrive,
  getMyTestDrives,
  getAdminTestDrives,
  updateTestDriveStatus,
} = require("../controllers/testDriveController");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, createTestDrive);
router.get("/my", protect, getMyTestDrives);
router.get("/admin", protect, adminOnly, getAdminTestDrives);
router.put("/:id/status", protect, adminOnly, updateTestDriveStatus);

module.exports = router;
