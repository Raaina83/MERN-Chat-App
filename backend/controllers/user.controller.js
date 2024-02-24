const User = require("../models/user.model.js");


module.exports.getUsersForSidebar = async(req,res) =>{
    try {
        const userId = req.user._id;

        const allUsers = await User.find({ _id: {$ne: userId}}).select("-password"); //return all users that are not equal(ne) to currently logged in user

        res.status(200).json(allUsers)

    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error)
        res.status(500).json({error: "Internal server Error"})
    }
}