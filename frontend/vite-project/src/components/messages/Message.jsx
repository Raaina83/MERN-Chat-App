import React from 'react'
import { extractTime } from '../../utils/extractTime';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion"
import {Box, Stack, Typography} from '@mui/material'
import { fileFormat } from '../../lib/features';

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
        backgroundColor: "#F9F8F8",
        alignSelf: fromMe ? "flex-end" : "flex-start",
        display: "flex",
        flexDirection: "row",
        margin: "1rem 1rem 0 0",
        padding: "0.5rem 0.5rem",
        borderRadius: "8px",
        width: "fit-content",
        maxWidth: "50%"
    }}
    initial={{opacity: 0, x: "-100%"}}
    whileInView={{opacity: 1, x: 0}}
    >
        <Stack>
        {/* <Typography variant='h6'>{name}</Typography> */}

         <Typography variant='h6'>{message.message}</Typography>
        </Stack>
         

         <Typography variant='caption'>{formattedTime}</Typography>

        {message.attachments.length > 0 && (message.attachments.map((attachment, index) => {
            const url = attachment.url
            const file = fileFormat(url)

            return (
                <Box key={index}>
                     <a href='' target='_blank' download></a>
                </Box>
            )
        }))}

        {/* <div className="chat-footer opacity-50">
            Delivered
        </div> */}
    </motion.div>

</>
  )
}

export default Message