const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  handleLogin,
  getAccount,
} = require("../controllers/user.controller");
const isAdmin = require("../middleware/isAdmin");

// Public routes

router.post("/register", createUser);
router.post("/login", handleLogin);
router.get("/account", getAccount);

// Admin routes
router.use(isAdmin);
router.get("/", getUsers);

// Protected routes

module.exports = router;
