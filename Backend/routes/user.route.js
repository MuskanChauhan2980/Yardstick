const express = require("express");
const router = express.Router();
const { loginDetails, healthCheck } = require("../controller/user.controller");

 
router.post("/auth/login", loginDetails);
router.get("/health", healthCheck);

module.exports = router;