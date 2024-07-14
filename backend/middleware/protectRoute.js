import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { ErrorHandler } from "../utils/utility.js";

const protectRoute = async(req, res, next) =>{
    try {
        const token  = req.cookies.jwt;
        if(!token){
            return next(new ErrorHandler("Unauthorized - no token provided", 401))
            // return res.status(401).json({error: "Unauthorized- No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //basically decoding the jwt token that we signed previously while user logged in

        if(!decoded){
            return next(new ErrorHandler("Unauthorized - invalid token", 401))
            // return res.status(401).json({error: "Unauthorized - invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");  //userId because we signed the jwt token using userID
        if(!user){
            return next(new ErrorHandler("User not found", 404))
            // return res.status(404).json({error: "User not found"});
        }
        req.user = user;

        next()

    } catch (error) {
        console.log("Error in middleware", error);
        next(error)
        // res.status(500).json({error: "Internal server Error"});
    }
}

export {protectRoute}