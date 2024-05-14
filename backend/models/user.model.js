import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    email: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    profile:{
        type: String,
        default: ""
    }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema) || mongoose.model.User