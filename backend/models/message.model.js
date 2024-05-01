import mongoose from "mongoose" ;
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    message:{
        type: String,
    }

    //createdAt and updatedAt (bcz of timestamps: true)
}, {timestamps: true})

export const Message = mongoose.model("Message", messageSchema)