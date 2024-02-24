const jwt = require("jsonwebtoken");

const generateTokenAndCookie = (userId, res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //millisecond(15days)
        httpOnly: true, //prevent XXS attacks--> cross-side scripting attacks
        sameSite: "strict", //CSRF attacks--> cross-site request frogery attacks 
        secure: process.env.NODE_ENV !== "development"
    });
}

module.exports = generateTokenAndCookie