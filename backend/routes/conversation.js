const express = require('express');
const router = express.Router();
const conversationController = require("../controllers/conversation.controller.js");
const protectRoute = require("../middleware/protectRoute");
const { newGroupValidator, validateHandlor, addMembersValidator, removeMemberValidator, leaveGroupValidator, renameGroupValidator, deleteGroupValidator, getMessagesValidator, chatIdValidator } = require('../lib/validators.js');

router.use(protectRoute)
router.post("/new",newGroupValidator(), validateHandlor , conversationController.newGroupChat)
router.get("/my", conversationController.getMyChat)
router.put("/addMembers", addMembersValidator() ,validateHandlor ,conversationController.addMembers)
router.delete("/removeMember", removeMemberValidator(), validateHandlor ,conversationController.removeMember)
router.delete("/leave/:id",chatIdValidator(), validateHandlor ,conversationController.leaveGroup)
router.get("/message/:id", chatIdValidator(), validateHandlor ,conversationController.getMessages)
router.route("/:id")                                    //chaining
        .get(chatIdValidator(), validateHandlor,conversationController.getChatDetails)
        .put(renameGroupValidator(), validateHandlor, conversationController.renameGroup)
        .delete(chatIdValidator(), validateHandlor ,conversationController.deleteChat) 


module.exports = router;