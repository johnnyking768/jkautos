const express = require("express");
const {
  getCars,
  getFeaturedCars,
  getBrands,
  getCarBySlug,
  createCar,
  updateCar,
  deleteCar,
  updateStatus,
  getAdminCars,
} = require("../controllers/carController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", optionalAuth, getCars);
router.get("/featured", getFeaturedCars);
router.get("/brands", getBrands);
router.get("/admin/all", protect, adminOnly, getAdminCars);
router.post("/", protect, adminOnly, createCar);
router.put("/:id", protect, adminOnly, updateCar);
router.delete("/:id", protect, adminOnly, deleteCar);
router.patch("/:id/status", protect, adminOnly, updateStatus);
router.get("/:slug", optionalAuth, getCarBySlug);

module.exports = router;
