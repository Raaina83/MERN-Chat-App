import mongoose from "mongoose";
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    name: {
        type: String,
    },
    profile: {
        type: String,
        // default: "https://wabetainfo.com/wp-content/uploads/2022/05/WA_GROUP_FB.png"
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