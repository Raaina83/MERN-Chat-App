// const { getSockets } = require("../lib/getSocket")
const {userSocketIDs} = require("../server.js")


module.exports.emitEvent = (req, event, users, data) => {
    const io = req.app.get("io")
    const usersSocket = getSockets(users)
    io.to(usersSocket.emit(event, data))
}

const getSockets = (users = []) => {
    const sockets = users.map((user) => userSocketIDs.get(user.toString()))

    return sockets
}