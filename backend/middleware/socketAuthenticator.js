import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";

const socketAuthenticator = async(err, socket, next) => {
    try {
        if(err) return next(err)

        const authToken = socket.request.cookies["jwt"]

        if(!authToken) throw new Error()

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

        socket.user = await User.findById(decodedData.userId)

        return next()

    } catch (error) {
        console.log(error)
        // throw new Error("Please login to access this route")
    }
}

export {socketAuthenticator}