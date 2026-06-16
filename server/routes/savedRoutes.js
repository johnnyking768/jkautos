const express = require("express");
const { toggleSavedCar, getSavedCars } = require("../controllers/savedController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getSavedCars);
router.post("/:carId", protect, toggleSavedCar);

module.exports = router;
