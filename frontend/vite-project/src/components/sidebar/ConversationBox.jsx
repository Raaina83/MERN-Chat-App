import React from 'react'
// import useGetConversations from '../../hooks/useGetConversations'
import Conversation from './Conversation'
import {useMyChatsQuery} from '../../redux/api/api'

function ConversationBox() {
  const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")
  // const {loading, conversations} = useGetConversations()
  return (
    <div id='conversation-box' className='h-[90%] overflow-auto'>
      {isLoading ? (<span className=' loading-spinner'></span>) : (
      data?.chats.map((conversation) => (
      <Conversation 
      key={conversation._id}
      conversation= {conversation}/>
    ))
    )}
  </div>
  )
}

export default ConversationBox