import {body, validationResult, param, query} from "express-validator"
import { ErrorHandler } from "../utils/utility.js"

const signUpValidator = () => [
    body("fullName", "Please enter your Fullname").notEmpty(),
    body("userName", "Please enter your Username").notEmpty(),
    body("password", "Please enter your Password").notEmpty(),
    body("email", "Please enter your Email").notEmpty(),
]

const loginValidator = () => [
    body(["userName", "password"]).notEmpty().withMessage("Please fill in all the fields")
]

const newGroupValidator = () => [
    body("name", "Please Enter name").notEmpty(),
    body("participants", "Please select members").notEmpty().isArray({ min: 2 })
]

const addMembersValidator = () => [
    body("chatId", "Please provide chatId").notEmpty(),
    body("participants", "Please select members").notEmpty().isArray({ min: 1, max: 97 })
]

const removeMemberValidator = () => [
    body("chatId", "Please Enter chatId").notEmpty(),
    body("userId", "Please Enter userId").notEmpty()
]

const renameGroupValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty(),
    body("name", "Please Enter new name").notEmpty()
]

const chatIdValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty(),
]

const sendRequestValidator = () => [
    body("userId", "Please Enter User ID").notEmpty(),
]

const acceptRequestValidator = () => [
    body("requestId", "Please Enter Request ID").notEmpty(),
    body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be a boolean value"),
]

const validateHandlor = (req,res, next) => {
    const errors = validationResult(req)
    const errorMsgs = errors.array().map((error) => error.msg).join(", ")

    if(errors.isEmpty()) return next()

    else next(new ErrorHandler(errorMsgs, 400))
}

export {
    signUpValidator,
    loginValidator,
    newGroupValidator,
    addMembersValidator,
    removeMemberValidator,
    renameGroupValidator,
    chatIdValidator,
    sendRequestValidator,
    acceptRequestValidator,
    validateHandlor
}