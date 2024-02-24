const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const protectRoute = require("../middleware/protectRoute");

router.get("/:id", protectRoute, messageController.getMessages)
router.post("/send/:id", protectRoute, messageController.sendMessage)

module.exports = router