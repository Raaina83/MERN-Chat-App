import React from 'react'
import { extractTime } from '../../utils/extractTime';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion"
import {Box} from '@mui/material'

function Message({message}) {
    const {user} = useSelector(state => state.auth)
    const formattedTime = extractTime(message.createdAt);
    const fromMe = user._id === message.senderId._id;
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? user.profile : message.senderId.profile; 
    const name = fromMe ? user.fullName : message.senderId.fullName;

  return (
    <>
    <motion.div className={`chat ${chatClassName}`}
    style={{
        backgroundColor: "rgb(248 250 252)",
    }}
    initial={{opacity: 0, x: "-100%"}}
    whileInView={{opacity: 1, x: 0}}
    >
        {/* <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src={profilePic} />
            </div>
        </div>
        <div className="chat-header">
        {name}
        <time className="text-xs opacity-50">{formattedTime}</time>
        </div>
        <div className="chat-bubble">{message.message}</div> */}

        {/* {message.attachments.length > 0 && (message.attachments.map((attachment, index) => {
            const url = attachment.url
            const file = fileFormat(url)

            return (
                <Box></Box>
            )
        }))} */}

        {/* <div className="chat-footer opacity-50">
            Delivered
        </div> */}
    </motion.div>

</>
  )
}

export default Message