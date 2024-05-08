import {User} from "../models/user.model.js";
import {Conversation} from "../models/conversation.model.js";
import {Request} from "../models/request.model.js";
import {getOtherMembers} from "../lib/helper.js";
import { emitEvent } from "../utils/features.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { ErrorHandler } from "../utils/utility.js";



const searchUser = async(req, res, next) => {
    try {
        const {name = ""} = req.query

        const myChats = await Conversation.find({ groupChat: false, participants: req.user._id})

        const allUserFriends = myChats.flatMap((chat) => chat.participants)

        const allUsersExceptFriends = await User.find({
            _id: { $nin: allUserFriends },
            userName: { $regex: name, $options: "i" }
        })

        const users = allUsersExceptFriends.map(({ _id, fullName, profile }) => ({
            _id,
            fullName,
            profile
        }))

        res.status(200).json({
            success: true,
            users
        })
        
    } catch (error) {
        console.log("Error in searchUser controller", error)
        next(error)
        // res.status(500).json({error: "Internal server Error"})
    }
}

const sendFriendRequest = async(req, res, next) => {
    try {
        const {userId} = req.body

        const request = await Request.findOne({
            $or:[
                {senderId: req.user._id, receiverId: userId},
                {senderId: userId, receiverId: req.user._id}
            ]
        })

        if(request) {
            return next(new ErrorHandler("Request already exists", 400))
            // throw new Error("Request already exists")
        }
    
        await Request.create({
            senderId: req.user._id,
            receiverId: userId
        })

        // console.log("req controller-->",req)
        emitEvent(req, NEW_REQUEST, [userId])

        return res.status(200).json({
            success: true,
            message: "Friend Request Sent"
        })
    } catch (error) {
        console.log("Error in sendFriendRequest controller", error)
        next(error)
        // return res.status(500).json({
        //     success: false,
        //     message: error.message
        // })
    }
}

const acceptFriendRequest = async(req, res, next) => {
    try {
        const {requestId, accept} = req.body

        const request = await Request.findById(requestId)
        .populate("senderId", "fullName profile")
        .populate("receiverId", "fullName profile")

        if(!request) return next(new ErrorHandler("Request does not exist", 404))

        if(request.receiverId._id.toString() !== req.user._id.toString()) return next(new ErrorHandler("Unauthorized", 401))

        if(!accept) {
            await request.deleteOne()

            return res.status(200).json({
                success: true,
                message: "Friend Request Rejected"
            })
        }

        const members = [request.senderId._id, request.receiverId._id]

        await Promise.all([
            Conversation.create({ 
                participants: members
            }),
            request.deleteOne()
        ])

        emitEvent(req, REFETCH_CHATS, members)

        return res.status(200).json({
            success: true,
            message: "Friend Request accepted",
            senderId: request.senderId._id
        })

    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error)
        next(error)
        // return res.status(500).json({
        //     success: false,
        //     message: error.message
        // })
    }
}

const notifications = async(req, res, next) => {
    try {
        const requests = await Request.find({ receiverId: req.user._id }).populate("senderId", "fullName profile")

        const allRequests = requests.map(({_id, senderId}) => ({
            _id,
            senderId: {
                _id: senderId._id,
                fullName: senderId.fullName,
                profile: senderId.profile
            }
        }))

        return res.status(200).json({
            success: true,
            requests: allRequests
        })

    } catch (error) {
        console.log("Error in notification controller", error)
        next(error)
        // return res.status(500).json({
        //     success: false,
        //     message: error.message
        // })   
    }
}

const getMyFriends = async(req, res, next) => {
    try {
        const chatId = req.query.chatId

        const chats = await Conversation.find({ participants: req.user._id, groupChat: false }).populate("participants", "fullName profile")

        const friends = chats.map(({participants}) => {
            const otherUser = getOtherMembers(participants, req.user._id)
            return {
                _id: otherUser._id,
                fullName: otherUser.fullName,
                profile: otherUser.profile
            }
        })

        if(chatId){
            const chat = await Conversation.findById(chatId)
            const availableFriends = friends.filter((friend) => !chat.participants.includes(friend._id))

            return res.status(200).json({
                success: true,
                availableFriends
            })

        } else {
            return res.status(200).json({
                success: true,
                friends
            })
        }

         

    } catch (error) {
        console.log("Error in getMyFriends controller", error)
        next(error)
        // return res.status(500).json({
        //     success: false,
        //     message: error.message
        // })   
    }
}

export {
    searchUser,
    sendFriendRequest,
    acceptFriendRequest,
    notifications,
    getMyFriends
}