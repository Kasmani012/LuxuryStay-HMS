
const express = require("express");
const router = express.Router();

const {
  addRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require("../controllers/roomController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add room
router.post("/", protect, adminOnly, addRoom);

// Logged-in users: View rooms
router.get("/", protect, getRooms);

// Logged-in users: View single room
router.get("/:id", protect, getRoomById);

// Admin only: Update room
router.put("/:id", protect, adminOnly, updateRoom);

// Admin only: Delete room
router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;
