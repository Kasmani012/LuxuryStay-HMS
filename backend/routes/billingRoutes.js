
const express = require("express");
const router = express.Router();

const {
  addBilling,
  getBillings,
  getBillingById,
  updateBilling,
  deleteBilling
} = require("../controllers/billingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add billing
router.post("/", protect, adminOnly, addBilling);

// Logged-in users: View billing
router.get("/", protect, getBillings);
router.get("/:id", protect, getBillingById);

// Admin only: Update and delete billing
router.put("/:id", protect, adminOnly, updateBilling);
router.delete("/:id", protect, adminOnly, deleteBilling);

module.exports = router;
