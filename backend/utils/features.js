// const { getSockets } = require("../lib/getSocket")
// const {getSockets} = require("../server.js")

import { getSockets } from "../lib/getSocket.js"

const emitEvent = (req, event, users, data) => {
    // console.log("req-->",req.app)
    const io = req.app.get("io")
    // console.log("io",io)
    const usersSocket = getSockets(users)
    io.to(usersSocket).emit(event, data)
}

export {emitEvent}

