import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import useGetMessages from '../../hooks/useGetMessages'
import MessageSkeleton from '../skeletons/MessageSkeleton';
import { getSocket } from '../../socket';


function MessageBox() {
  const {messages, loading}  = useGetMessages()
  const lastMessageRef = useRef();

  const socket = getSocket()

  const [message, setMessage] = useState("")

  useEffect(() =>{
    setTimeout(() =>{
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth"});
    }, 100)
  }, [messages])

  return (
    <div className='z-10 p-2 overflow-auto h-[70%]'>
        {loading && <MessageSkeleton/>}

        {!loading && messages.length === 0 && (
          <p className='ms-[12rem] text-lg mt-4'>Send a message to start conversation</p>
        )}

        {!loading && messages.length > 0 && messages.map((message) =>(
          <div key={message._id}
          ref={lastMessageRef}>
            <Message message= {message}/>  
          </div>
        ))}
    </div>
  )
}

export default MessageBox