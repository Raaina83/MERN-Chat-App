import {User} from  "../models/user.model.js";
import bcrypt from  "bcryptjs";
import {generateTokenAndCookie}  from "../utils/generateToken.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/features.js";


const login = async(req, res, next) =>{
    try {
        const {userName, password} = req.body;
        const user = await User.findOne({userName});
        const isValidPassword = await bcrypt.compare(password, user?.password || "");

        if(!user || !isValidPassword){
            return next(new ErrorHandler("Invalid username or password", 404))
            // return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndCookie(user._id, res, `Welcome back ${user.fullName}`);

        return res.status(200).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            profile: user.profile,
        })
    } catch (error) {
        console.log("Error in login controller", error)
        next(error)
        // return res.status(500).json({error: error.message})
    }
}

const signup = async(req, res, next) =>{
    try {
        const {fullName, userName, password, confirmPassword ,email, gender} = req.body;
        // console.log(fullName, userName, password, confirmPassword ,email, gender)

        if(password !== confirmPassword){
            return next(new ErrorHandler("Passwords does not match", 400))
            // return res.status(400).json({error: "Passwords does not match"});
        }

        const user = await User.findOne({userName});

        if(user){
            return next(new ErrorHandler("User already exists", 400))
            // return res.status(400).json({error: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        const newUser = new User({
            fullName: fullName,
            userName: userName,
            password: hashedPassword,
            gender: gender,
            email: email,
            profile: gender === "male" ? boyProfile : girlProfile 
        });

        if(newUser){
            //generate jwt token and cookie
            generateTokenAndCookie(newUser._id, res, "User created");
            await newUser.save();

        return res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            gender: newUser.gender,
            profile: newUser.profile
        });
        } else{
            return next(new ErrorHandler("Invalid data", 400))
            // return res.status(400).json("Invalid data")
        }
    } catch (error) {
        console.log("Error in signup controller", error)
        next(error)
        // return res.status(500).json({error: "Internal server Error"})
    }
}

const logout = (req, res, next) =>{
    try {
        return res
        .cookie("jwt", "", {...cookieOptions, maxAge: 0})
        .status(200)
        .json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log("Error in logout controller", error)
        next(error)
        // return res.status(500).json({error: "Internal server Error"})
    }
}

export {
    login,
    signup,
    logout
}