import {User} from "../models/user.model.js";
import {Conversation} from "../models/conversation.model.js";
import {Request} from "../models/request.model.js";
import {getOtherMembers} from "../lib/helper.js";
import { emitEvent } from "../utils/features.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "../middleware/error.js";

const getMyProfile = TryCatch(async(req, res, next) => {
    const user = await User.findById(req.user);
    if (!user) return next(new ErrorHandler("User not found", 404));
  
    res.status(200).json({
      success: true,
      user,
    });
})

const searchUser = TryCatch(async(req, res, next) => {
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
            profile: profile.url
        }))

        return res.status(200).json({
            success: true,
            users
        })
})

const sendFriendRequest = TryCatch(async(req, res, next) => {
    const {userId} = req.body

        const request = await Request.findOne({
            $or:[
                {senderId: req.user._id, receiverId: userId},
                {senderId: userId, receiverId: req.user._id}
            ]
        })

        if(request) {
            return next(new ErrorHandler("Request already exists", 400))
        }
    
        await Request.create({
            senderId: req.user._id,
            receiverId: userId
        })

        emitEvent(req, NEW_REQUEST, [userId])

        return res.status(200).json({
            success: true,
            message: "Friend Request Sent"
        })
})

const acceptFriendRequest = TryCatch(async(req, res, next) => {
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
})

const notifications = TryCatch(async(req, res, next) => {
    const requests = await Request.find({ receiverId: req.user._id }).populate("senderId", "fullName profile")

        const allRequests = requests.map(({_id, senderId}) => ({
            _id,
            senderId: {
                _id: senderId._id,
                fullName: senderId.fullName,
                profile: senderId.profile.url
            }
        }))

        return res.status(200).json({
            success: true,
            requests: allRequests
        })
})

const getMyFriends = TryCatch(async(req, res, next) => {
    const chatId = req.query.chatId

        const chats = await Conversation.find({ participants: req.user._id, groupChat: false }).populate("participants", "fullName profile")

        const friends = chats.map(({participants}) => {
            const otherUser = getOtherMembers(participants, req.user._id)
            return {
                _id: otherUser._id,
                fullName: otherUser.fullName,
                profile: otherUser.profile.url
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
})

export {
    getMyProfile,
    searchUser,
    sendFriendRequest,
    acceptFriendRequest,
    notifications,
    getMyFriends
}