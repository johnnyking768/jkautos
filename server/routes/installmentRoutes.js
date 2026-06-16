const express = require("express");
const { getPlans, calculate, apply, getMyInstallments } = require("../controllers/installmentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/plans", getPlans);
router.post("/calculate", calculate);
router.post("/apply", protect, apply);
router.get("/my", protect, getMyInstallments);

module.exports = router;
