const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const userController = require("../controllers/user.controller");
const { sendRequestValidator, validateHandlor, acceptRequestValidator } = require("../lib/validators");

const router = express.Router();

router.use(protectRoute)
router.get("/", userController.getUsersForSidebar)
router.get("/search", userController.searchUser)
router.put("/sendrequest",sendRequestValidator(), validateHandlor ,userController.sendFriendRequest)
router.put("/acceptrequest", acceptRequestValidator(), validateHandlor ,userController.acceptFriendRequest)
router.get("/notifications", userController.notifications)
// router.get("/")

module.exports = router;