import jwt from "jsonwebtoken"

const generateTokenAndCookie = (userId, res, message) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    return res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //millisecond(15days)
        httpOnly: true, //prevent XXS attacks--> cross-side scripting attacks
        sameSite: "strict", //CSRF attacks--> cross-site request frogery attacks 
        secure: process.env.NODE_ENV !== "development"
    }).json({
        success: true,
        message
    });
}

export {generateTokenAndCookie}