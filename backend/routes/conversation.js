import express  from 'express';
const router = express.Router();
import {newGroupChat, getMyChat ,addMembers, removeMember, leaveGroup, getMessages, getChatDetails, renameGroup, deleteChat, getMyGroups, sendAttachments}  from "../controllers/conversation.controller.js";
import {protectRoute}  from "../middleware/protectRoute.js";
import { newGroupValidator, validateHandlor, addMembersValidator, removeMemberValidator, renameGroupValidator, chatIdValidator }  from '../lib/validators.js';
import { attachmentsMulter } from '../middleware/multer.js';


router.use(protectRoute)
router.post("/new",newGroupValidator(), validateHandlor , newGroupChat)
router.get("/my", getMyChat)
router.get("/my/groups", getMyGroups)
router.put("/addMembers", addMembersValidator() ,validateHandlor ,addMembers)
router.put("/removeMember", removeMemberValidator(), validateHandlor ,removeMember)
router.delete("/leave/:id",chatIdValidator(), validateHandlor ,leaveGroup)
router.post("/message", attachmentsMulter, sendAttachments)
router.get("/message/:id", chatIdValidator(), validateHandlor ,getMessages)
router.route("/:id")                                    //chaining
        .get(chatIdValidator(), validateHandlor,getChatDetails)
        .put(renameGroupValidator(), validateHandlor, renameGroup)
        .delete(chatIdValidator(), validateHandlor ,deleteChat) 


export default router;