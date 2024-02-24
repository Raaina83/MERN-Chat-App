const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message:{
        type: String,
        required: true
    }

    //createdAt and updatedAt (bcz of timestamps: true)
}, {timestamps: true})

module.exports = mongoose.model("Message", messageSchema)