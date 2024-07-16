import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";
import { TryCatch, errorMiddleware } from "../middleware/error.js";
import {Conversation} from "../models/conversation.model.js";
import {Message} from "../models/message.model.js";
import {User} from "../models/user.model.js";
import { emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";



const newGroupChat = TryCatch(async(req, res, next) => {
    const {name, participants} = req.body

        if(participants.length < 2) {
            return next(ErrorHandler("Chat must have at least 3 members", 400))
        }
        const allParticipants = [...participants, req.user]
        const profileAddress = {
            url: "https://wabetainfo.com/wp-content/uploads/2022/05/WA_GROUP_FB.png"
        }
    
        await Conversation.create({
            name: name,
            profile: profileAddress,
            groupChat: true,
            creator: req.user._id,
            participants: allParticipants,
        })
        
        emitEvent(req, ALERT, allParticipants, `Welcome to ${name} group!`)
        emitEvent(req, REFETCH_CHATS, participants)

        return res.status(201).json({
            success: true,
            message: "Group Chat created"
        })
})

const getMyChat = TryCatch(async(req, res, next) => {
    const conversations= await Conversation.find({ participants: req.user._id }).populate(
        "participants",
        "fullName userName profile"
    )

    const transformedConversations = conversations.map(({_id, groupChat, name,profile,participants}) => {
        const otherMembers = getOtherMembers(participants, req.user._id)

       return {
        _id,
        groupChat,
        profile: groupChat? [profile.url] : [otherMembers.profile.url],
        name: groupChat? [name] : [otherMembers.fullName],
        participants: participants.reduce((prev, curr) => {
            if(curr._id.toString() !== req.user._id.toString()){
                prev.push(curr._id)
            }
            return prev
        }, [])
       }
    })

    return res.status(200).json({
      success: true,
      chats: transformedConversations  
    })
})

const getMyGroups = TryCatch(async(req, res, next) => {
    const chats = await Conversation.find({ 
        participants: req.user._id,
        groupChat: true,
        creator: req.user._id
    }).populate("participants", "fullName profile")

    const groups = chats.map(( _id, groupChat, fullName, profile) => ({
        _id,
        // participants,
        fullName,
        groupChat,
        profile: profile.url
    }))

    return res.status(201).json({ 
        success: true,
        groups
    })
})

const addMembers = TryCatch(async(req, res, next) => {
        const {chatId, participants} = req.body
        const group = await Conversation.findById(chatId)

        if (!group) return next(new ErrorHandler("Chat not found", 404));

        if(!participants || participants.length < 1){
            return next(new ErrorHandler("Please select members", 400))
        }

        if(!group.groupChat){
            return next(new ErrorHandler("This is not a group chat", 400))
        }
        if(group.creator.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler("You are not allowed to add members"), 403)
        }
        const allNewMembersPromise = participants.map((i) => User.findById( i, "fullName" ))

        const allNewMembers = await Promise.all(allNewMembersPromise)
        const uniqueMembers = allNewMembers.filter((i) => !group.participants.includes(i._id.toString())).map((i) => i._id)

        group.participants.push(...uniqueMembers)

        if(group.participants.length > 100){
            return next(new ErrorHandler("Group members limit reached", 400))
        }

        await group.save()

        const allUsersName = allNewMembers.map((i) => i.fullName).join(", ");

        // emitEvent(req, REFETCH_CHATS, group.participants);

        emitEvent(
            req,
            ALERT,
            group.participants,
            {
                message: `${allUsersName} has been removed from the group`,
                chatId
            }
          );
        

        return res.status(200).json({
            success: true,
            message: "members added successfully"
        })
})

const removeMember = TryCatch(async(req, res, next) => {
    const {chatId, userId} = req.body
        const [chat, userToRemove] = await Promise.all([
            Conversation.findById(chatId),
            User.findById(userId, "fullName")
        ])

        if(!userToRemove || userToRemove.length < 1){
            throw new Error("Please select members.")
        }

        if(!chat) {
            return next(new ErrorHandler("Chat not found", 404))
        }
        if(!chat.groupChat){
            return next(new ErrorHandler("This is not a group chat", 400))
        }
        if(chat.creator.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler("You are not allowed to remove members", 403))
        }
        if(chat.participants.length <= 3){
            return next(new ErrorHandler("Group must have at least 3 members", 400))
        }

        const allChatMembers = chat.participants.map((i) => i.toString());

        //make sure to come back and cover the case when userToRemove is not part of the group
        chat.participants = chat.participants.filter((participant) => participant.toString() !== userId.toString())

        await chat.save()

        emitEvent(req, ALERT, chat.participants, {
            message: `${userToRemove.fullName} has been removed from the group`,
            chatId
        })
        // emitEvent(req, REFETCH_CHATS, allChatMembers)

        return res.status(200).json({
            success: true,
            message: "Member removed successfully"
        })
})

const leaveGroup = TryCatch(async(req, res, next) => {
    const chatId = req.params.id
        const chat = await Conversation.findById(chatId)

        if(!chat) {
            return next(new ErrorHandler("Chat not found", 404))
        }
        if(!chat.groupChat){
            return next(new ErrorHandler("This is not a group chat", 400))
        }

        const remainingMembers = chat.participants.filter(
            (participant) => participant.toString() !== req.user._id.toString()
        )

        if(remainingMembers.length < 3){
            return next(new ErrorHandler("Group must have at least 3 members", 400))
        }

        if(chat.creator.toString() === req.user._id.toString()){
            const newCreator = remainingMembers[0]
            chat.creator = newCreator
        }
        
        chat.participants = remainingMembers
        const [user] = await Promise.all([
            User.findById(req.user._id),
            chat.save()
        ])

        emitEvent(req, ALERT, chat.participants, {
            message:`${user} has left the group `,
            chatId})

        return res.status(200).json({
            success: true,
            message: "Left group successfully"
        })
})

const sendAttachments = TryCatch(async(req, res, next) => {
    const {chatId} = req.body
    
    const [chat, user] = await Promise.all(
        [Conversation.findById(chatId),
        User.findById(req.user._id, ("username _id"))
        ]
    )


    if(!chat) return next(new ErrorHandler("Chat not found", 404))

    // if(chat.includes)

    const files = req.files || []

    if(files.length < 1) return next(new ErrorHandler("Please provide attachments", 400))

    const attachments = await uploadFilesToCloudinary(files)

    const messageForDB = {
        chat: chatId,
        message: "",
        attachments,
        senderId: req.user._id
    }

    const messageForRealTime = {
        ...messageForDB,
        senderId: {
            _id: user._id,
            name: user.username
        }
    }

    const message = await Message.create(messageForDB)

    emitEvent(req, NEW_ATTACHMENT, chat.participants, {
        message: messageForRealTime,
        chatId
    })

    emitEvent(req, NEW_MESSAGE_ALERT, chat.participants, {chatId})

    return res.status(200).json({
        success: true,
        message
    })
})

const getChatDetails = TryCatch(async(req, res, next) =>{
    if(req.query.populate === "true"){
        const chatId = req.params.id

        const chat = await Conversation.findById(chatId).populate("participants", "fullName profile")
        
        if(!chat){
            return next(ErrorHandler("Chat not found", 404))
        }

        chat.participants = chat.participants.map((_id, fullName, profile) => ({
            _id,
            fullName,
            profile: profile.url
        }))

        return res.status(200).json({
            success: true,
            chat
        })
    } else{
        const chatId = req.params.id
        const chat = await Conversation.findById(chatId)

        if(!chat){
            return next(ErrorHandler("Chat not found", 404))
        }

        return res.status(200).json({
            success: true,
            chat
        })
    }
})

const renameGroup = TryCatch(async(req, res, next) => {
    const chatId = req.params.id
        const {name} = req.body
        const chat = await Conversation.findById(chatId)

        if(!chat){
            return next(new ErrorHandler("Chat not found", 404))
        }

        if(!chat.groupChat){
            return next(new ErrorHandler("This is not a group chat", 403))
        }

        if(chat.creator.toString() !== req.user._id.toString()){
            return next(new ErrorHandler("You are not allowed to rename this group", 403))
        }

        chat.name = name

        await chat.save()

        emitEvent(req, REFETCH_CHATS, chat.participants)

        return res.status(200).json({
            success: true,
            message: "Group renamed successfully"
        })
})

const deleteChat = TryCatch(async(req, res, next) => {
    const chatId = req.params.id
        const chat = await Conversation.findById(chatId)

        if(!chat){
            return next(new ErrorHandler("Chat not found", 404))
        }

        const participants = chat.participants

        if(chat.groupChat && chat.creator.toString() !== req.user._id.toString()){
            return next(new ErrorHandler("You are not allowed to delete this group", 403))
        }

        if(!chat.groupChat && !chat.participants.includes(req.user._id.toString())){
            return next(new ErrorHandler("You are not allowed to delete this group", 403))
        }


        await Promise.all([
            chat.deleteOne(),
            Message.deleteMany({ chat: chatId }),
        ])

        emitEvent(req, REFETCH_CHATS, participants)

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        })
})

const getMessages = TryCatch(async(req, res, next) => {
    const chatId = req.params.id
        const { page = 1 } = req.query

        const resultPerPage = 20 //limit
        const skip = resultPerPage * (page - 1)

        const chat  = await Conversation.findById(chatId)

        if(!chat) return next(new ErrorHandler("Chat not found", 404))

        if(chat.participants.includes(req.user.toString())){
            return next(new ErrorHandler("You are not allowed to access this chat", 403))
        }

        const [messages, totalMessagesCount] = await Promise.all([
            Message.find({chat: chatId})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(resultPerPage)
                .populate("senderId", "fullName profile")
                .lean(),
            Message.countDocuments({ chat: chatId })
        ])

        const totalPages = Math.ceil(totalMessagesCount / resultPerPage)
        
        return res.status(200).json({
            success: true,
            messages: messages.reverse(),
            totalPages
        })
})

export {
    newGroupChat,
    getMyChat,
    getMyGroups,
    addMembers,
    removeMember,
    leaveGroup,
    sendAttachments,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages
}



