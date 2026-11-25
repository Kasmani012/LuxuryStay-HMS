
const express = require("express");
const router = express.Router();

const {
  addReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} = require("../controllers/reservationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add reservation
router.post("/", protect, adminOnly, addReservation);

// Logged-in users: View reservations
router.get("/", protect, getReservations);
router.get("/:id", protect, getReservationById);

// Admin only: Update and delete
router.put("/:id", protect, adminOnly, updateReservation);
router.delete("/:id", protect, adminOnly, deleteReservation);

module.exports = router;
