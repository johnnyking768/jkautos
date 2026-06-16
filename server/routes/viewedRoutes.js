const express = require("express");
const { addRecentlyViewed, getRecentlyViewed } = require("../controllers/viewedController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getRecentlyViewed);
router.post("/:carId", protect, addRecentlyViewed);

module.exports = router;
