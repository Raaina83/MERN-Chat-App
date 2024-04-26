import { Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import useConversation from '../../zustand/useConversation'

function ChatItem({
    name, 
    _id, 
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChatOpen
}) {
    const {selectedConversation, setSelectedConversation} = useConversation()
    const isSelected = selectedConversation?._id === _id
  return (
    <Link 
        sx={{
            padding: "0",
        }}
       to={`/chat/${_id}`} 
       onContextMenu={(e) => handleDeleteChatOpen(e, _id, groupChat)}>
        <div>
            {/* Avatar Card */}
        <Stack>
            <Typography>{name}</Typography>

            {newMessageAlert && (
                <Typography>{newMessageAlert.count}</Typography>
            )}
        </Stack>
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