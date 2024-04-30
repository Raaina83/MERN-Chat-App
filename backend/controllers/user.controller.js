const User = require("../models/user.model.js");
const Conversation = require("../models/conversation.model.js");
const Request = require("../models/request.model.js");
const {getOtherMembers} = require("../lib/helper.js");
const { emitEvent } = require("../utils/features.js");
const { NEW_REQUEST } = require("../constants/events.js");


module.exports.getUsersForSidebar = async(req,res) =>{
    try {
        const userId = req.user._id;

        const allUsers = await User.find({ _id: {$ne: userId}}).select("-password"); //return all users that are not equal(ne) to currently logged in user

        res.status(200).json(allUsers)

    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error)
        res.status(500).json({error: "Internal server Error"})
    }
}

module.exports.searchUser = async(req,res) => {
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
        res.status(500).json({error: "Internal server Error"})
    }
}

module.exports.sendFriendRequest = async(req, res) => {
    try {
        const {userId} = req.body

        const request = await Request.findOne({
            $or:[
                {senderId: req.user._id, receiverId: userId},
                {senderId: userId, receiverId: req.user._id}
            ]
        })

        if(request) throw new Error("Request already exists")
    
        await Request.create({
            senderId: req.user._id,
            receiverId: userId
        })

        emitEvent(req, NEW_REQUEST, [userId])

        return res.status(200).json({
            success: true,
            message: "Friend Request Sent"
        })
    } catch (error) {
        console.log("Error in sendFriendRequest controller", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports.acceptFriendRequest = async(req, res) => {
    try {
        const {requestId, accept} = req.body

        const request = await Request.findById(requestId)
        .populate("senderId", "fullName profile")
        .populate("receiverId", "fullName profile")

        if(!request) throw new Error("Request not found")//404

        if(request.receiverId._id.toString() !== req.user._id.toString()) throw new Error("Unauthorized")

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

        return res.status(200).json({
            success: true,
            message: "Friend Request accepted",
            senderId: request.senderId._id
        })

    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports.notifications = async(req, res) => {
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
        console.log("Error in acceptFriendRequest controller", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })   
    }
}

module.exports.getMyFriends = async(req, res) => {
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
        console.log("Error in acceptFriendRequest controller", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })   
    }
}