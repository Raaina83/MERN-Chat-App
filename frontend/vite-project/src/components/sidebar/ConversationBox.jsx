import React from 'react'
import Conversation from './Conversation'
import {useMyChatsQuery} from '../../redux/api/api'
import ChatItem from '../shared/ChatItem'

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
  console.log("chats-->", chats)
  // const {loading, conversations} = useGetConversations()
  return (
    <div id='conversation-box' className='h-[90%] overflow-auto'>
      { chats?.map((data, index) =>{
        console.log("data-->",data)
        // const {profile, _id, name, groupChat, participants} = data
        // console.log(name)

        const newMessageAlert  = newMessagesAlert.find(
          ({chatId}) => chatId === data._id
        )

        const isOnline = data.participants.some((member) => onlineUsers.includes(member))

        return (<ChatItem 
          name= {data.name[0]}
          _id= {data._id}
          groupChat= {data.groupChat}
          newMessageAlert= {newMessageAlert}
          isOnline= {isOnline}
          index= {index}
          key={data._id}
          sameSender ={chatId === data._id}
          handleDeleteChatOpen={handleDeleteChat}
        />)
      })}
  </div>
  )
}

export default ConversationBox