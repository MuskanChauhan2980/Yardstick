const express = require("express");
const router = express.Router();
const { loginDetails, healthCheck,getUserData } = require("../controller/user.controller");
const { authenticate } = require("../middleware.controller.js/usermiddleware");
 
router.post("/login", loginDetails);
router.get("/health", healthCheck);
router.get('/user',authenticate,getUserData)

module.exports = router;