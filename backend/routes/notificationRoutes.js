
const express = require("express");
const router = express.Router();

const {
  addNotification,
  getNotifications,
  updateNotification,
  deleteNotification
} = require("../controllers/notificationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add notification
router.post("/", protect, adminOnly, addNotification);

// Logged-in users: View notifications
router.get("/", protect, getNotifications);

// Admin only: Update and delete notifications
router.put("/:id", protect, adminOnly, updateNotification);
router.delete("/:id", protect, adminOnly, deleteNotification);

module.exports = router;
