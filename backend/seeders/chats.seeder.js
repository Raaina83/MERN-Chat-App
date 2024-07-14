const { faker } = require('@faker-js/faker');
const User = require("../models/user.model.js");
const Conversation = require("../models/conversation.model.js");
const Message = require("../models/message.model.js");

module.exports.createSingleChats = async(numChats) => {
    try {
        const users = await User.find().select("_id fullName")

        const chatsPromise = []

        for(let i = 0; i< users.length; i++) {
            for(let j = i + 1; j< users.length; j++) {
                chatsPromise.push(
                    Conversation.create({
                        participants: [users[i]._id, users[j]._id ],
                    })
                )
            }
        }

        await Promise.all(chatsPromise)

        console.log("chats ctreated successfully")
        process.exit()

    } catch (error) {
        console.log(error)
        process.exit()  
    }
}

module.exports.createMessages = async (numMessages) => {
    try {
        const users = await User.find().select("_id")
        const chats = await Conversation.find().select("_id")

        const messagePromise = []

        for(let i=0; i<numMessages; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)]
            const randomChat = chats[Math.floor(Math.random() * chats.length)]

            messagePromise.push(
                Message.create({
                    senderId: randomUser,
                    chat: randomChat,
                    message: faker.lorem.sentence()
                })
            )
        }

        await Promise.all(messagePromise)
        console.log("messages were crearted successsfully")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit()
    }
}