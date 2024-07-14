import {userSocketIDs} from "../server.js"

const getSockets = (users = []) => {
    const sockets = users.map((user) => userSocketIDs.get(user.toString()))

    return sockets
}

export {getSockets}