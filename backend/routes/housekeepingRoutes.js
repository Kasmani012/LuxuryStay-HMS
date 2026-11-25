
const express = require("express");
const router = express.Router();

const {
  addTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/housekeepingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add task
router.post("/", protect, adminOnly, addTask);

// Logged-in users: View tasks
router.get("/", protect, getTasks);

// Admin only: Update and delete tasks
router.put("/:id", protect, adminOnly, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;
