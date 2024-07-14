import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import { searchUser, sendFriendRequest, acceptFriendRequest, notifications, getMyFriends, getMyProfile} from "../controllers/user.controller.js";
import { sendRequestValidator, validateHandlor, acceptRequestValidator } from "../lib/validators.js";

const router = express.Router();

router.use(protectRoute)
// router.get("/",  getUsersForSidebar)
router.get("/me", getMyProfile)
router.get("/search",  searchUser)
router.put("/sendrequest",sendRequestValidator(), validateHandlor , sendFriendRequest)
router.put("/acceptrequest", acceptRequestValidator(), validateHandlor , acceptFriendRequest)
router.get("/notifications",  notifications)
router.get("/friends", getMyFriends)
// router.get("/")

export default router;