const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller.js");

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/signup", authController.signup);

module.exports = router;