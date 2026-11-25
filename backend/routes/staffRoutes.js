
const express = require("express");
const router = express.Router();

const {
  addStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff
} = require("../controllers/staffController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add staff
router.post("/", protect, adminOnly, addStaff);

// Logged-in users: View staff
router.get("/", protect, getStaff);
router.get("/:id", protect, getStaffById);

// Admin only: Update and delete staff
router.put("/:id", protect, adminOnly, updateStaff);
router.delete("/:id", protect, adminOnly, deleteStaff);

module.exports = router;
