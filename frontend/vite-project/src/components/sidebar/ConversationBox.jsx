import React from 'react'
import useGetConversations from '../../hooks/useGetConversations'
import Conversation from './Conversation'

function ConversationBox() {
  const {loading, conversations} = useGetConversations()
  return (
    <div id='conversation-box' className='h-[90%] overflow-auto'>
      {conversations.map((conversation) => (
        <Conversation 
        key={conversation._id}
        conversation= {conversation}/>
      ))}

        {loading? <span className='loading loading-spinner'></span>: null}
    </div>
  )
}

export default ConversationBox