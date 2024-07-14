import { Box, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import useConversation from '../../zustand/useConversation'
import { motion } from "framer-motion"

function ChatItem({
    name, 
    _id, 
    groupChat = false,
    profile,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat
}) {
  
  return (
    <Link 
        sx={{
            padding: "0",
        }}
       to={`/chat/${_id}`} 
       onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>

        <motion.div /*className={`hover:bg-gray-300  h-[75px] w-full my-2 ${isSelected? "bg-gray-300" : ""}`*/
        initial= {{opacity: 0, y: "-100%"}}
        whileInView={{opacity: 1, y: 0}}
        // transition={{ delay: 0.1 * index }}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: sameSender ? "rgb(209 213 219)" : "unset",
          padding: "1rem 0",
          position: "relative"
        }}>
          <div className='flex h-full pt-2 ps-2'>
              <div className='avatar  rounded-full w-[50px] h-[50px] mx-2'>
                  <img src={profile[0]} className='rounded-full'></img>
              </div>

              <div className='flex flex-1 border-b-2 border-gray-300 me-4'>
                  <div className='flex pt-2 flex-col'>
                      <Typography>{name}</Typography>
                      {newMessageAlert && <Typography>{newMessageAlert.count} New Messages</Typography>}
                  </div>
              </div>
          </div>

          {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>

        
    </Link>
  )
}

export default memo(ChatItem)