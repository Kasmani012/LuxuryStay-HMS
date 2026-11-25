
const express = require("express");
const router = express.Router();

const {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
  deleteMaintenance
} = require("../controllers/maintenanceController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add maintenance task
router.post("/", protect, adminOnly, addMaintenance);

// Logged-in users: View maintenance tasks
router.get("/", protect, getMaintenance);

// Admin only: Update and delete
router.put("/:id", protect, adminOnly, updateMaintenance);
router.delete("/:id", protect, adminOnly, deleteMaintenance);

module.exports = router;
