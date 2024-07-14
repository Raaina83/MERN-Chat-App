import React, { useCallback, useEffect, useState } from 'react'
import MessageHeader from './MessageHeader'
import MessageBox from './MessageBox'
import MessageInput from './MessageInput'
import NoChatSelected from './NoChatSelected'
import useConversation from '../../zustand/useConversation'
import { getSocket } from '../../socket';
import { NEW_MESSAGE } from '../../constants/events'
import { useChatDetailsQuery } from '../../redux/api/api'
import { useSocketEvents } from '../../hooks/hooks'

function MessageContainer({}) {
  const {selectedConversation, setSelectedConversation} = useConversation()
  const chatId = selectedConversation?._id

  const socket = getSocket()

  
  const chatDetails = useChatDetailsQuery({chatId, skip: !chatId})
  const participants =  chatDetails?.data?.chat?.participants

  const [message, setMessage] = useState("")

  const messageInputHandler = (e) => {
    setMessage(e.target.value)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if(!message.trim()) return 

    //Emitting the message to server
    socket.emit(NEW_MESSAGE, {chatId , participants, message})
    setMessage("")


    console.log(message)
  }

  if(selectedConversation){
    const newMessageHandler = useCallback((data) => {
      console.log(data)
    })
  
    const eventArr = { [NEW_MESSAGE]: newMessageHandler}
  
    // useSocketEvents(socket, eventArr)
    
  }

  return chatDetails?.isLoading? (<span className=' loading loading-spinner'></span>) : (
    <div className='flex flex-col sm:w-[75%] relative h-[100%]  w-[100%]'>
      {!selectedConversation? <NoChatSelected/> : (
        <>
    {/* <MessageHeader conversationUser= {selectedConversation}/> */}
    <MessageBox/>
    <MessageInput value={message} handler={messageInputHandler} handleSubmit={submitHandler}/>
    </>
  )}
    </div>
  )
}

export default MessageContainer