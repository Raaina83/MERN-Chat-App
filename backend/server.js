const express = require('express')
const dotenv = require("dotenv")

const auth = require("./routes/auth.js")
const message = require("./routes/message.js")
const user = require("./routes/user.js")

const connectToMongoDB = require("./db/connectToMongodb.js");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000


dotenv.config()

app.use(express.json()); //to parse the incoming request with JSON payloads from req.body
app.use(cookieParser());

app.use("/api/auth", auth)
app.use("/api/messages", message)
app.use("/api/users", user)

app.listen(PORT,() =>{
    connectToMongoDB();
    console.log(`App is listening on port ${PORT}`)
})