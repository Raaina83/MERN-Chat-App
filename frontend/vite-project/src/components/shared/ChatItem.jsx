import { Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import useConversation from '../../zustand/useConversation'

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
    const {selectedConversation, setSelectedConversation} = useConversation()
    const isSelected = selectedConversation?._id === _id
  return (
    <Link 
        sx={{
            padding: "0",
        }}
       to={`/chat/${_id}`} 
       onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>
        <div className={`hover:bg-gray-300  h-[75px] w-full my-2 ${isSelected? "bg-gray-300" : ""}`}
    // onClick={() => {setSelectedConversation(conversation)}}
    >
    <div className='flex h-full pt-2 ps-2'>
        <div className='avatar online rounded-full w-[50px] h-[50px] mx-2'>
            <img src={profile[0]} className='rounded-full'></img>
        </div>

        <div className='flex flex-1 border-b-2 border-gray-300 me-4'>
            <div className='flex pt-2'>
                <p className='text-md ms-4'>{name}</p>
            </div>
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
    </Link>
  )
}

export default memo(ChatItem)