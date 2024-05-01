import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

const protectRoute = async(req, res, next) =>{
    try {
        const token  = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "Unauthorized- No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //basically decoding the jwt token that we signed previously while user logged in

        if(!decoded){
            return res.status(401).json({error: "Unauthorized - invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");  //userId because we signed the jwt token using userID
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        req.user = user;

        next()

    } catch (error) {
        console.log("Error in middleware", error);
        res.status(500).json({error: "Internal server Error"});
    }
}

export {protectRoute}