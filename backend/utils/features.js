// const { getSockets } = require("../lib/getSocket")
// const {getSockets} = require("../server.js")

import { getSockets } from "../lib/getSocket.js"

const emitEvent = (req, event, users, data) => {
    console.log("emit data-->",data,users)
    // console.log("req-->",req.app)
    const io = req.app.get("io")
    // console.log("io",io)
    const usersSocket = getSockets(users)
    io.to(usersSocket).emit(event, data)
}

const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, //millisecond(15days)
        httpOnly: true, //prevent XXS attacks--> cross-side scripting attacks
        sameSite: "none", //CSRF attacks--> cross-site request frogery attacks 
        secure: true
}

export {emitEvent, cookieOptions}

