const express = require("express");
const { createMessage, getMyMessages, getAdminMessages, replyMessage } = require("../controllers/messageController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", optionalAuth, createMessage);
router.get("/my", protect, getMyMessages);
router.get("/admin", protect, adminOnly, getAdminMessages);
router.put("/:id/reply", protect, adminOnly, replyMessage);

module.exports = router;
