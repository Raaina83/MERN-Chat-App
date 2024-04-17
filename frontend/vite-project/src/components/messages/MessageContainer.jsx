import React, { useEffect } from 'react'
import MessageHeader from './MessageHeader'
import MessageBox from './MessageBox'
import MessageInput from './MessageInput'
import NoChatSelected from './NoChatSelected'
import useConversation from '../../zustand/useConversation'

function MessageContainer() {
  const {selectedConversation, setSelectedConversation} = useConversation()

  useEffect(() =>{

    //cleanup function(unmounting)
    return () => setSelectedConversation(null)
  },[])

  return (
    <div className='flex flex-col w-[75%] relative h-[100%]'>
      {!selectedConversation? <NoChatSelected/> : (
        <>
    {/* <MessageHeader conversationUser= {selectedConversation}/> */}
    <MessageBox/>
    <MessageInput/>
    </>
  )}
    </div>
  )
}

export default MessageContainer