import React from 'react'
import ChatItem from '../shared/ChatItem'
import { Stack } from '@mui/material'

function ConversationBox({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0
    },
  ],
  handleDeleteChat
}) {
  return (
    <Stack height={"100%"} overflow={"auto"}>
      { chats?.map((data, index) =>{
        const newMessageAlert  = newMessagesAlert.find(
          ({chatId}) => chatId === data._id
        )

        const isOnline = data?.participants?.some((member) => onlineUsers.includes(member))
        console.log("isonlinme",isOnline)

        return (<ChatItem 
          name= {data.name[0]}
          _id= {data._id}
          groupChat= {data.groupChat}
          profile= {data.profile}
          newMessageAlert= {newMessageAlert}
          isOnline= {isOnline}
          index= {index}
          key={data._id}
          sameSender ={chatId === data._id}
          handleDeleteChat={handleDeleteChat}
        />)
      })}
  </Stack>
  )
}

export default ConversationBox