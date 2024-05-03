import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import {getUsersForSidebar, searchUser, sendFriendRequest, acceptFriendRequest, notifications, getMyFriends} from "../controllers/user.controller.js";
import { sendRequestValidator, validateHandlor, acceptRequestValidator } from "../lib/validators.js";

const router = express.Router();

router.use(protectRoute)
router.get("/",  getUsersForSidebar)
router.get("/search",  searchUser)
router.put("/sendrequest",sendRequestValidator(), validateHandlor , sendFriendRequest)
router.put("/acceptrequest", acceptRequestValidator(), validateHandlor , acceptFriendRequest)
router.get("/notifications",  notifications)
router.get("/friends", getMyFriends)
// router.get("/")

export default router;