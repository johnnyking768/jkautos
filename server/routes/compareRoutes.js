const express = require("express");
const { getCompareList, toggleCompare, clearCompare } = require("../controllers/compareController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCompareList);
router.post("/:carId", protect, toggleCompare);
router.delete("/", protect, clearCompare);

module.exports = router;
