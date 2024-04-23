const {userSocketIDs} = require("../server.js")

module.exports.getSockets = (users = []) => {
    const sockets = users.map((user) => userSocketIDs.get(user.toString()))

    return sockets
}