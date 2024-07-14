import multer from "multer";

export const multerUpload = multer({
    limits: {
        fileSize:  5 * 1024 * 1024 //(5MB)
    }
})

const singleProfile = multerUpload.single("profile")

const attachmentsMulter = multerUpload.array("files", 5)

export {singleProfile, attachmentsMulter}