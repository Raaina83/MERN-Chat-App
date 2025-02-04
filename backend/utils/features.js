import { getSockets } from "../lib/getSocket.js"
import {v2 as cloudinary} from 'cloudinary'
import {v4 as uuid} from "uuid"
import { getBase64 } from "../lib/helper.js"

const emitEvent = (req, event, users, data) => {
    console.log("emit data-->",data,users)
    // console.log("req-->",req.app)
    const io = req.app.get("io")
    // console.log("io",io)
    const usersSocket = getSockets(users)
    io.to(usersSocket).emit(event, data)
}

const uploadFilesToCloudinary = async(files=[]) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                resource_type: "auto",
                public_id: uuid()
            } ,(error, result) => {
                if(error) {
                    return reject(error)
                }
                resolve(result)
            })
        })
    })

    try {
        const results = await Promise.all(uploadPromises)

        const formattedResult = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url
        }))

        return formattedResult
    } catch (error) {
        console.log(error)
        throw new Error("Error uploading files to cloudinary", error)
    }
}

const deleteFilesFromCloudinary = async(public_ids) => {

}

const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, //millisecond(15days)
        httpOnly: true, //prevent XXS attacks--> cross-side scripting attacks
        sameSite: "none", //CSRF attacks--> cross-site request frogery attacks 
        secure: true
}

export {emitEvent, cookieOptions, uploadFilesToCloudinary, deleteFilesFromCloudinary}

