const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const userController = require("../controllers/user.controller")

const router = express.Router();

router.get("/", protectRoute , userController.getUsersForSidebar)

module.exports = router;