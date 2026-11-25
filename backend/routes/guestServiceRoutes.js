
const express = require("express");
const router = express.Router();

const {
  addService,
  getServices,
  updateService,
  deleteService
} = require("../controllers/guestServiceController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add service
router.post("/", protect, adminOnly, addService);

// Logged-in users: View services
router.get("/", protect, getServices);

// Admin only: Update and delete services
router.put("/:id", protect, adminOnly, updateService);
router.delete("/:id", protect, adminOnly, deleteService);

module.exports = router;
