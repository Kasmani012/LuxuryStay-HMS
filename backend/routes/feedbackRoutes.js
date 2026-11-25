
const express = require("express");
const router = express.Router();

const {
  addFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback
} = require("../controllers/feedbackController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add feedback
router.post("/", protect, adminOnly, addFeedback);

// Logged-in users: View feedback
router.get("/", protect, getFeedback);

// Admin only: Update and delete feedback
router.put("/:id", protect, adminOnly, updateFeedback);
router.delete("/:id", protect, adminOnly, deleteFeedback);

module.exports = router;
