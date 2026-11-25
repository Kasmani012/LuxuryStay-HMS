
const express = require("express");
const router = express.Router();

const {
  addGuest,
  getGuests,
  getGuestById,
  updateGuest,
  deleteGuest
} = require("../controllers/guestController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only
router.post("/", protect, adminOnly, addGuest);

// Logged-in users
router.get("/", protect, getGuests);
router.get("/:id", protect, getGuestById);

// Admin only
router.put("/:id", protect, adminOnly, updateGuest);
router.delete("/:id", protect, adminOnly, deleteGuest);

module.exports = router;
