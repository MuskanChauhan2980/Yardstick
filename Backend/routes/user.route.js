const express = require("express");
const router = express.Router();
const { loginDetails, healthCheck,getUserData } = require("../controller/user.controller");
const { authenticate } = require("../middleware.controller.js/usermiddleware");
 
router.post("/auth/login", loginDetails);
router.get("/", healthCheck);
router.get('/auth/user',authenticate,getUserData)

module.exports = router;