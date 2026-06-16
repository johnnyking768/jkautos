const express = require("express");
const { getAdminStats, getCustomers, toggleCustomer, getSales, createPlan, updatePlan } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protect, adminOnly);
router.get("/stats", getAdminStats);
router.get("/customers", getCustomers);
router.put("/customers/:id/toggle", toggleCustomer);
router.get("/sales", getSales);
router.post("/installments/plans", createPlan);
router.put("/installments/plans/:id", updatePlan);

module.exports = router;
