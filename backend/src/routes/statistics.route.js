const express = require("express");
const router = express.Router();
const { getStatistics } = require("../controllers/statistics.controller");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

router.get("/", authentication, isAdmin, getStatistics);

module.exports = router;
