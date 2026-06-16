const express = require("express");
const { createReview, getReviewsByCar } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReview);
router.get("/car/:carId", getReviewsByCar);

module.exports = router;
