const {body, validationResult, param, query} = require("express-validator")

module.exports.newGroupValidator = () => [
    body("name", "Please Enter name").notEmpty(),
    body("participants", "Please select members").notEmpty().isArray({ min: 2 })
]

module.exports.addMembersValidator = () => [
    body("chatId", "Please provide chatId").notEmpty(),
    body("participants", "Please select members").notEmpty().isArray({ min: 1, max: 97 })
]

module.exports.removeMemberValidator = () => [
    body("chatId", "Please Enter chatId").notEmpty(),
    body("userId", "Please Enter userId").notEmpty()
]


module.exports.renameGroupValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty(),
    body("name", "Please Enter new name").notEmpty()
]

module.exports.chatIdValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty(),
]

module.exports.sendRequestValidator = () => [
    body("userId", "Please Enter User ID").notEmpty(),
]

module.exports.acceptRequestValidator = () => [
    body("requestId", "Please Enter Request ID").notEmpty(),
    body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be a boolean value"),
]

module.exports.validateHandlor = (req,res, next) => {
    const errors = validationResult(req)
    const errorMsgs = errors.array().map((error) => error.msg)

    if(errors.isEmpty()) return next()
    else next(new Error(errorMsgs))
}