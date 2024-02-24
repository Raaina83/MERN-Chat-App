const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const generateTokenAndCookie  =require("../utils/generateToken.js");


module.exports.login = async(req,res) =>{
    try {
        const {userName, password} = req.body;
        const user = await User.findOne({userName});
        const isValidPassword = await bcrypt.compare(password, user?.password || "");

        if(!user || !isValidPassword){
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            profile: user.profile,
        })
    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json({error: "Internal server Error"})
    }
}

module.exports.signup = async(req,res) =>{
    try {
        const {fullName, userName, password, confirmPassword ,email, gender} = req.body;
        // console.log(fullName, userName, password, confirmPassword ,email, gender)

        if(password !== confirmPassword){
            return res.status(400).json({error: "Passwords does not match"});
        }

        const user = await User.findOne({userName});

        if(user){
            console.log(user);
            return res.status(400).json({error: "User already exists"});
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
            generateTokenAndCookie(newUser._id, res);
            await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            gender: newUser.gender,
            profile: newUser.profile
        });
        } else{
            res.status(400).json("Invalid data")
        }
    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({error: "Internal server Error"})
    }
}

module.exports.logout = (req,res) =>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json("Logged out successfully")
    } catch (error) {
        console.log("Error in logout controller", error)
        res.status(500).json({error: "Internal server Error"})
    }
}