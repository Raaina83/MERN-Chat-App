import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";
import { errorMiddleware } from "../middleware/error.js";
import {Conversation} from "../models/conversation.model.js";
import {Message} from "../models/message.model.js";
import {User} from "../models/user.model.js";
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";



const newGroupChat = async(req,res) => {
    try {
        const {name, participants} = req.body

        if(participants.length < 2) {
            return res.status(400).json({error: "Chat must have at least 3 members"})
        }
        const allParticipants = [...participants, req.user]
        const profileAddress = "https://wabetainfo.com/wp-content/uploads/2022/05/WA_GROUP_FB.png"
    
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
    } catch (error) {
        console.log("Error in newGroupChat middleware", error)
        res.status(500).json({error: error.message})
    }
}

const getMyChat = async(req, res) => {
    try {
        const conversations= await Conversation.find({ participants: req.user._id }).populate(
            "participants",
            "fullName userName profile"
        )

        const transformedConversations = conversations.map(({_id, groupChat, name,profile,participants}) => {
            const otherMembers = getOtherMembers(participants, req.user._id)

           return {
            _id,
            groupChat,
            profile: groupChat? [profile] : [otherMembers.profile],
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
    } catch (error) {
        console.log("Error in getMyChat middleware", error)
        res.status(500).json({error: error.message})   
    }
}

const getMyGroups = async(req, res) => {
    try {
        const chats = await Conversation.find({ 
            participants: req.user._id,
            groupChat: true,
            creator: req.user._id
        }).populate("participants", "fullName profile")

        // const groups = chats.map((chat) => (
        //     chat.name,
        //     chat.profile = [chat.profile],
        //     chat.participants,
        //     chat.creator,
        //     chat.createdAt,
        //     chat._id,
        //     chat.updatedAt
        // ))
        return res.status(201).json({ 
            success: true,
            groups: chats
        })
    } catch (error) {
        console.log("Error in getMyGroups middleware", error)
        res.status(500).json({error: error.message})   
    }
}

const addMembers = async(req,res, next) => {
    try {
        const {chatId, participants} = req.body
        const group = await Conversation.findById(chatId)

        if (!group) return next(new ErrorHandler("Chat not found", 404));

        if(!participants || participants.length < 1){
            return next(new ErrorHandler("Please select members", 400))
        }
        // if(!group) {
        //     throw new Error("Chat not found")//404
        // }
        if(!group.groupChat){
            return next(new ErrorHandler("This is not a group chat", 400))
        }
        if(group.creator.toString() !== req.user._id.toString()) {
            throw new Error("You are not allowed to add members") //403(forbidden)
        }
        const allNewMembersPromise = participants.map((i) => User.findById( i, "fullName" ))

        const allNewMembers = await Promise.all(allNewMembersPromise)
        const uniqueMembers = allNewMembers.filter((i) => !group.participants.includes(i._id.toString()))

        group.participants.push(...uniqueMembers.map((i) => i._id))

        if(group.participants.length > 100){
            throw new Error("Group members limit reached")//400
        }

        await group.save()

        const allUsersName = allNewMembers.map((i) => i.fullName).join(", ");

        emitEvent(
            req,
            ALERT,
            group.participants,
            `${allUsersName} has been added in the group`
          );
        
          emitEvent(req, REFETCH_CHATS, group.participants);

        return res.status(200).json({
            success: true,
            message: "members added successfully"
        })

    } catch (error) {
        console.log("Error in addMembers middleware", error)
        res.status(500).json({error: error.message})    
    }
}

const removeMember = async(req,res, next) => {
    try {
        const {chatId, userId} = req.body
        const [chat, userToRemove] = await Promise.all([
            Conversation.findById(chatId),
            User.findById(userId, "fullName")
        ])

        if(!userToRemove || userToRemove.length < 1){
            throw new Error("Please select members.")
        }

        if(!chat) {
            throw new Error("Chat not found")//404
        }
        if(!chat.groupChat){
            throw new Error("This is not a group chat") //400(bad request)
        }
        if(chat.creator.toString() !== req.user._id.toString()) {
            throw new Error("You are not allowed to remove members") //403(forbidden)
        }
        if(chat.participants.length <= 3){
            return next(new ErrorHandler("Group must have at least 3 members", 400))
            // throw new Error("Group must have at least 3 members")
        }
        //make sure to come back and cover the case when userToRemove is not part of the group
        chat.participants = chat.participants.filter((participant) => participant.toString() !== userId.toString())

        await chat.save()

        emitEvent(req, ALERT, chat.participants, `${userToRemove} has been removed from the group `)
        emitEvent(req, REFETCH_CHATS, chat.participants)

        return res.status(200).json({
            success: true,
            message: "Member removed successfully"
        })

    } catch (error) {
        console.log("Error in removeMember middleware", error)
        // res.status(500).json({error: error.message}) 
        next(error)
    }
}

const leaveGroup = async(req,res) => {
    try {
        const chatId = req.params.id
        const chat = await Conversation.findById(chatId)

        if(!chat) {
            throw new Error("Chat not found")//404
        }
        if(!chat.groupChat){
            throw new Error("This is not a group chat") //400(bad request)
        }

        const remainingMembers = chat.participants.filter(
            (participant) => participant.toString() !== req.user._id.toString()
        )

        if(remainingMembers.length < 3){
            throw new Error("Group must have at least 3 members")
        }

        if(chat.creator.toString() === req.user._id.toString()){
            const newCreator = remainingMembers[0]
            chat.creator = newCreator
        }
        
        chat.participants = remainingMembers
        await chat.save()

        emitEvent(req, ALERT, chat.participants, `${userToRemove} has left the group `)
        emitEvent(req, REFETCH_CHATS, chat.participants)

        return res.status(200).json({
            success: true,
            message: "Left group successfully"
        })
    } catch (error) {
        console.log("Error in leaveGroup middleware", error)
        res.status(500).json({error: error.message}) 
    }
}

const getChatDetails = async(req,res) => {
    try {
        if(req.query.populate === "true"){
            const chatId = req.params.id
            console.log("chatId", chatId)

            const chat = await Conversation.findById(chatId).populate("participants", "fullName profile")
            
            if(!chat){
                throw new Error("Chat not found")
            }

            return res.status(200).json({
                success: true,
                chat
            })
        } else{
            const chatId = req.params.id
            console.log("chatId", chatId)
            const chat = await Conversation.findById(chatId)

            if(!chat){
                throw new Error("Chat not found")
            }

            return res.status(200).json({
                success: true,
                chat
            })
        }


    } catch (error) {
        console.log("Error in getChatDetails middleware", error)
        res.status(500).json({error: error.message}) 
    }
}

const renameGroup = async(req,res) => {
    try {
        const chatId = req.params.id
        const {name} = req.body
        const chat = await Conversation.findById(chatId)

        if(!chat){
            throw new Error("Chat not found")
        }

        if(!chat.groupChat){
            throw new Error("This not a group chat")
        }

        if(chat.creator.toString() !== req.user._id.toString()){
            throw new Error("You are not allowed to rename this group")
        }

        chat.name = name

        await chat.save()

        emitEvent(req, REFETCH_CHATS, chat.participants)

        return res.status(200).json({
            success: true,
            message: "Group renamed successfully"
        })

    } catch (error) {
        console.log("Error in renameGroup middleware", error)
        res.status(500).json({error: error.message})
    }
}

const deleteChat = async(req,res) => {
    try {
        const chatId = req.params.id
        const chat = await Conversation.findById(chatId)

        if(!chat){
            throw new Error("Chat not found")
        }

        const participants = chat.participants

        if(chat.groupChat && chat.creator.toString() !== req.user._id.toString()){
            throw new Error("You are not allowed to delete this group")
        }

        if(!chat.groupChat && !chat.participants.includes(req.user._id.toString())){
            throw new Error("You are not allowed to delete this group")
        }

        // const messages = await Message.find({ chat: chatId})

        await Promise.all([
            chat.deleteOne(),
            Message.deleteMany({ chat: chatId }),
        ])

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        })
        
    } catch (error) {
        console.log("Error in deleteChat middleware", error)
        res.status(500).json({error: error.message})
    }
}

const getMessages = async(req,res) => {
    try {
        const chatId = req.params.id
        const { page = 1 } = req.query

        const resultPerPage = 20 //limit
        const skip = resultPerPage * (page - 1)

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

    } catch (error) {
        console.log("Error in getMessages middleware", error)
        res.status(500).json({error: error.message})
    }
}

export {
    newGroupChat,
    getMyChat,
    getMyGroups,
    addMembers,
    removeMember,
    leaveGroup,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages
}



