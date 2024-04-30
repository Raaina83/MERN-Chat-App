import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import Message from '../../components/messages/Message.jsx'
import { Skeleton, Stack, Typography } from '@mui/material'
import { RiAttachment2 } from "react-icons/ri";
import {BsSend} from 'react-icons/bs'
import { getSocket } from '../../socket.jsx'
import { NEW_MESSAGE } from '../../constants/events.js'
import { useChatDetailsQuery, useGetAllMessagesQuery } from '../../redux/api/api.js'
import { useErrors, useSocketEvents } from '../../hooks/hooks.jsx'
import {useInfiniteScrollTop} from '6pp'

const Chat= ({chatId}) => {
  const containerRef = useRef(null)
  const socket = getSocket()

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState("")
  const [page, setPage] = useState(1)

  const chatDetails =  useChatDetailsQuery({chatId, skip: !chatId})

  const oldMessagesChunk = useGetAllMessagesQuery({chatId, page}) 

  const {data: oldMessages, setData: setOldMessages} = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.messages
  )

  const errors = [
    {isError: chatDetails.isError,
    error: chatDetails.error},
    {isError: oldMessagesChunk.isError,
    error: oldMessagesChunk.error}
  ]

  const participants = chatDetails?.data?.chat?.participants

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!message.trim()) return 

    //Emitting message to the server
    socket.emit(NEW_MESSAGE, { chatId, participants, message})
    setMessage("")
  }

  const newMessagesHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data.message])
  }, [])

  console.log("oldmessages", oldMessages)

  const eventHandler = {[NEW_MESSAGE] : newMessagesHandler}

  useSocketEvents(socket, eventHandler)

  useErrors(errors)

  const allMessages = [...oldMessages, ...messages]


  return chatDetails.isLoading ? (<Skeleton></Skeleton>) : (
    <>
    <Stack ref={containerRef} overflow={"auto"} height={"90%"}>
      {/* {!oldMessagesChunk.isLoading && oldMessagesChunk?.data?.messages?.map((message) => <Message message={message} key={message._id}/>)} */}

      {allMessages.length > 0 ? (
        allMessages.map((message) => <Message message={message} key={message._id}/>)
        ) : (
        <Typography textAlign={"center"} padding={"1rem"}>Send a Message to start conversation</Typography>
        )}

    </Stack>


      <form className='flex bg-slate-100 p-4 absolute w-[66.6%] h-[10%] bottom-0' onSubmit={handleSubmit}>
        <div className='w-[70%] relative m-auto flex justify-center items-center'>
          <button className='absolute start-4'><RiAttachment2/></button>
        <input
        type='text'
        placeholder='Send a message'
        className=' rounded-md p-2 w-full ps-[4rem] text-black'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        // onChange={handler}
        />
        <button className=' absolute inset-y-0 end-4' type='submit'>
          <BsSend/>
            {/* {loading? <span className='loading loading-spinner'></span> : <BsSend/>} */}
        </button>
        </div>
      </form>
    
    </>
  ) 
}

export default AppLayout()(Chat)