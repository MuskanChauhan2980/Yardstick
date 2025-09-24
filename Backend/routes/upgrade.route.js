const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../middleware.controller.js/usermiddleware");
const { upgradeFeature } = require("../controller/upgrade.controller")

router.post("/tenants/:slug/upgrade", authenticate, requireAdmin, upgradeFeature)

// Corrected the typo here
module.exports = router;