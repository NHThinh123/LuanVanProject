const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  handleLogin,
  getAccount,
  getUserById,
  updateUser,
  updateAvatar,
} = require("../controllers/user.controller");
const isAdmin = require("../middleware/isAdmin");
const authentication = require("../middleware/authentication");
const uploadUserCloud = require("../middleware/uploadUserCloud");

// Public routes
router.post("/register", createUser);
router.post("/login", handleLogin);

// Protected routes (yêu cầu JWT)
router.get("/account", authentication, getAccount);
router.get("/:id", authentication, getUserById);
router.put("/:id", authentication, updateUser);
router.post(
  "/avatar",
  authentication,
  uploadUserCloud.single("avatar"),
  updateAvatar
);
// Admin routes (yêu cầu JWT và role admin)
router.get("/", authentication, getUsers);

module.exports = router;
