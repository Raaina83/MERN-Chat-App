const Conversation = require("../models/conversation.model.js");
const Message = require("../models/message.model.js");


module.exports.getMessages = async(req,res) =>{
    try {
        const {id: userToChatID} = req.params;
        const userId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all : [userId, userToChatID]}
        }).populate("messages");
        
        if(!conversation) {
            res.status(200).json([]);
            return
        }

        res.status(200).json(conversation.messages);

    } catch (error) {
        console.log("Error in getmessage middleware", error)
        res.status(500).json({error: "Internal server Error"})
    }
}

module.exports.sendMessage = async(req, res) =>{
    try {
        const {id: receiverId} = req.params;
        const {message} = req.body;

        const senderId = req.user._id;
        
        let conversation = await Conversation.findOne({
            participants: { $all : [senderId, receiverId]}
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        //socket io functionality will go here

        // await conversation.save();
        // await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()]); //will run parallely

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in message middleware", error)
        res.status(500).json({error: "Internal server Error"})
    }
}