const express = require("express");
const router = express.Router();

// import controllers
const { registerUser, loginUser, getUserProfile, logoutUser } = require("../controllers/auth");
const { protect } = require("../middleware/authMiddleware");

// public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// private routes
router.get("/profile", protect, getUserProfile);
router.post("/logout", protect, logoutUser);

module.exports = router;