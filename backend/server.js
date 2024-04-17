const express = require('express')
const dotenv = require("dotenv")
const {createServer} = require('http')
const { Server, Socket } = require('socket.io')
const {v4} = require('uuid')
const cors = require('cors')

const auth = require("./routes/auth.js")
const message = require("./routes/message.js")
const user = require("./routes/user.js")
const conversation = require("./routes/conversation.js")

const connectToMongoDB = require("./db/connectToMongodb.js");
const app = express();
const server = createServer(app)
const io = new Server(server, {})

const cookieParser = require("cookie-parser");
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require('./constants/events.js')
const { getSockets } = require('./lib/helper.js')
const Message = require('./models/message.model.js')
// const { createSingleChats, createMessages } = require('./seeders/chats.seeder.js')
const PORT = process.env.PORT || 5000
const userSocketIDs = new Map() //all the active users connected



dotenv.config()

app.use(express.json()); //to parse the incoming request with JSON payloads from req.body
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))


app.use("/api/v1/auth", auth)
app.use("/api/v1/messages", message)
app.use("/api/v1/users", user)
app.use("/api/v1/chat", conversation)

io.use((socket, next) => {})

io.on("connection", (socket) => {
    const user = {
        _id: "djh",
        fullName: "Manya"
    }

    userSocketIDs.set(user._id.toString(), socket.id)

    console.log("user connected", socket.id)

    socket.on(NEW_MESSAGE, async({chatId, participants, message}) => {
        const messageRealTime = {
            message: message,
            _id: v4(),
            senderId: {
                _id: user._id,
                fullName: user.fullName
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

    socket.on("disconnect", () => {
        console.log("user disconnected")
        userSocketIDs.delete(user._id.toString())
    })
})

server.listen(PORT,() =>{
    connectToMongoDB();
    console.log(`App is listening on port ${PORT}`)
})

module.exports = userSocketIDs