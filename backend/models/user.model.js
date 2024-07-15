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
    profile:{
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
    },
    bio: {
        type: String,
        maxlength: 100
    }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema) || mongoose.model.User