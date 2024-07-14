import {User} from  "../models/user.model.js";
import bcrypt from  "bcryptjs";
import {generateTokenAndCookie}  from "../utils/generateToken.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/features.js";
import { TryCatch } from "../middleware/error.js";


const login = TryCatch(async (req, res, next) => {
    const {userName, password} = req.body;
        const user = await User.findOne({userName});
        const isValidPassword = await bcrypt.compare(password, user?.password || "");

        if(!user || !isValidPassword){
            return next(new ErrorHandler("Invalid username or password", 404))
            // return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndCookie(user, res, `Welcome back ${user.fullName}`);

        // return res.status(200).json({
        //     _id: user._id,
        //     userName: user.userName,
        //     fullName: user.fullName,
        //     profile: user.profile,
        // })
})

const signup = TryCatch(async(req, res, next) => {
    const {fullName, userName, password, confirmPassword ,email, gender} = req.body;
    console.log(fullName, userName, password, confirmPassword, email, gender)

        if(password !== confirmPassword){
            return next(new ErrorHandler("Passwords does not match", 400))
        }

        const user = await User.findOne({userName});

        if(user){
            return next(new ErrorHandler("User already exists", 400))
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

        await newUser.save()
        

        generateTokenAndCookie(newUser, res, "User created");
})

const logout = TryCatch(async(req, res, next) => {
    return res
        .cookie("jwt", "", {...cookieOptions, maxAge: 0})
        .status(200)
        .json({
            success: true,
            message: "Logged out successfully"
        })
})

export {
    login,
    signup,
    logout
}