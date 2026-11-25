
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Admin routes
router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
