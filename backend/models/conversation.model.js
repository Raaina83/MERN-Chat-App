import mongoose from "mongoose";
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    name: {
        type: String,
    },
    profile: {
        url: {
            type: String,
            required: true
        }
    },
    groupChat: {
        type: Boolean,
        default: false,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
}, {timestamps: true})

export const Conversation =  mongoose.model("Conversation", conversationSchema)