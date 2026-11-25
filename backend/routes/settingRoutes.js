
const express = require("express");
const router = express.Router();

const {
  addSetting,
  getSettings,
  updateSetting,
  deleteSetting
} = require("../controllers/settingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add settings
router.post("/", protect, adminOnly, addSetting);

// Logged-in users: View settings
router.get("/", protect, getSettings);

// Admin only: Update and delete settings
router.put("/:id", protect, adminOnly, updateSetting);
router.delete("/:id", protect, adminOnly, deleteSetting);

module.exports = router;
