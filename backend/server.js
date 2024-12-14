import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import { createServer } from 'http'
import {Server} from 'socket.io'
import {v4} from 'uuid'
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'

import auth from "./routes/auth.js"
import user from "./routes/user.js"
import conversation from "./routes/conversation.js"

import {connectToMongoDB} from "./db/connectToMongodb.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


import cookieParser from "cookie-parser"
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from './constants/events.js'
import {Message} from './models/message.model.js'
import { socketAuthenticator } from './middleware/socketAuthenticator.js'
import { getSockets } from './lib/getSocket.js'
import { errorMiddleware } from './middleware/error.js'
// const { createSingleChats, createMessages } = require('./seeders/chats.seeder.js')
const PORT = process.env.PORT || 5000
const userSocketIDs = new Map() //all the active users connected
const onlineUsers = new Set() //unique users

const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors:  ({
        origin: ["http://localhost:5173", "http://localhost:5000"], 
        credentials: true
    })
})



app.set("io", io)

app.use(express.json()); //to parse the incoming request with JSON payloads from req.body
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5000"], 
    credentials: true
}))




app.use("/api/v1/auth", auth)
app.use("/api/v1/users", user)
app.use("/api/v1/chat", conversation)

io.use((socket, next) => {
    cookieParser()(
        socket.request, 
        socket.request.res, 
        async (err) => {
        await socketAuthenticator(err, socket, next)
    })
})

io.on("connection", (socket) => {
    const user = socket.user
    // console.log(user)

    userSocketIDs.set(user._id.toString(), socket.id)

    socket.on(NEW_MESSAGE, async({chatId, participants, message}) => {
        const messageRealTime = {
            message: message,
            _id: v4(),
            senderId: {
                _id: user._id,
                fullName: user.fullName,
                profile: user.profile
            },
            chat: chatId,
            createdAt: new Date().toISOString()
        }

        const messageForDB = {
            message: message,
            senderId: user._id,
            chat: chatId
        }

        const usersSocket = getSockets(participants)
        io.to(usersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageRealTime,
        })

        io.to(usersSocket).emit(NEW_MESSAGE_ALERT, {chatId})

        try {
            await Message.create(messageForDB)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on(START_TYPING, ({participants, chatId}) => {
        console.log("start-typing", chatId)

        const membersSocket = getSockets(participants)
        socket.to(membersSocket).emit(START_TYPING, {chatId})
    })

    socket.on(STOP_TYPING, ({participants, chatId}) => {
        console.log("stop typing", chatId)

        const membersSocket = getSockets(participants)
        socket.to(membersSocket).emit(STOP_TYPING, {chatId})
    })

    socket.on(CHAT_JOINED, ({userId, participants}) => {
        onlineUsers.add(userId.toString())

        const membersSocket = getSockets(participants)
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers))
    })

    socket.on(CHAT_LEAVED, ({userId, participants}) => {
        onlineUsers.delete(userId.toString())

        const membersSocket = getSockets(participants)
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers))
    })

    socket.on("disconnect", () => {
        userSocketIDs.delete(user._id.toString())
    })
})

app.use(errorMiddleware)

server.listen(PORT,() =>{
    connectToMongoDB();
    console.log(`App is listening on port ${PORT}`)
})


export {userSocketIDs}