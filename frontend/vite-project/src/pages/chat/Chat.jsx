import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import Message from '../../components/messages/Message.jsx'
import { IconButton, Skeleton, Stack, Typography } from '@mui/material'
import { RiAttachment2 } from "react-icons/ri";
import {BsSend} from 'react-icons/bs'
import { getSocket } from '../../socket.jsx'
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../../constants/events.js'
import { useChatDetailsQuery, useGetAllMessagesQuery } from '../../redux/api/api.js'
import { useErrors, useSocketEvents } from '../../hooks/hooks.jsx'
import {useInfiniteScrollTop} from '6pp'
import { useDispatch } from 'react-redux';
import { removeNewMessagesAlert } from '../../redux/reducers/chat.js';
import TypingLoader from '../../components/layout/TypingLoader.jsx';
import { useNavigate } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

const Chat= ({chatId}) => {
  const containerRef = useRef(null)
  const bottomRef = useRef(null)
  const socket = getSocket()

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState("")
  const [page, setPage] = useState(1)

  const [IAmTyping, setIAmTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const typingTimeout = useRef(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId))
    return() => {
      setMessage("")
      setMessages([])
      setOldMessages([])
      setPage(1)
    }
  }, [chatId])

  useEffect(() => {
    if(chatDetails.isError) return navigate("/")
  }, [chatDetails.isError])

  useEffect(() => {
    if(bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth"})
  }, [messages])

  const newMessagesListener = useCallback((data) => {
    if(data.chatId !== chatId) return
    console.log("message alert-->",data.message)

    setMessages((prev) => [...prev, data.message])
  }, [chatId])

  const startTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return

    setUserTyping(true)
  }, [chatId])

  const stopTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return

    setUserTyping(false)
  }, [chatId])


  const chatInputHandler = (e) => {
    setMessage(e.target.value)

    if(!IAmTyping){
      socket.emit(START_TYPING, {participants, chatId})
      setIAmTyping(true)
    }

    if(typingTimeout.current) clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => { //returns id
      socket.emit(STOP_TYPING, {participants, chatId})
      setIAmTyping(false)
    }, [2000])
  }

  
  const alertListener = useCallback((data) => {
    if(data.chatId !== chatId) return

    console.log("alert data-->", data)
    const messageForAlert = {
      message: data.message,
      _id: "chcioehiwhnj",
      senderId: {
          _id: "bdwjdhwhdhk",
          fullName: "Admin",
          profile: "hkwhd"
      },
      chat: chatId,
      createdAt: new Date().toISOString()
  }

    console.log("alert-->",messageForAlert)

    setMessages((prev) => [...prev, messageForAlert])
    console.log("messages after alert-->",messages)
  }, [chatId])

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE] : newMessagesListener,
    [START_TYPING] : startTypingListener,
    [STOP_TYPING] : stopTypingListener,
  }

  useSocketEvents(socket, eventHandler)

  useErrors(errors)

  const allMessages = [...oldMessages, ...messages]


  return chatDetails.isLoading ? (<Skeleton></Skeleton>) : (
    <>
    <Stack ref={containerRef} height={"90%"} 
    sx={{
      overflowX: "hidden",
      overflowY: "auto"
    }}>

      {allMessages.map((message) => <Message message={message} key={message._id}/>)}

        {userTyping && <TypingLoader/>}

        <div ref={bottomRef}/>

    </Stack>

    <form
    style={{
      height:"10%",
    }}
    onSubmit={handleSubmit}>
      <Stack
      display={"flex"}
      direction={"row"}
      position={"relative"}
      height={"100%"}
      padding={"0.5rem"}
      alignItems={"center"}
      justifyContent={"center"}
      style={{
        backgroundColor: "rgb(203 213 225)"
      }}>
        <IconButton
        sx={{
          position: 'absolute',
          left: "7.3rem",
          rotate: "30deg"
        }}>
          <AttachFileIcon/>
        </IconButton>
        <input
        style={{
          width: "80%",
          height: "100%",
          border: "none",
          padding: "0 3.5rem",
          borderRadius: "0.5rem",
        }}
        value={message}
        onChange={chatInputHandler}/>
        <IconButton
        sx={{
          position: "absolute",
          right: "7rem"
        }}>
          <SendIcon/>
        </IconButton>
      </Stack>
    </form>


      {/* <form className='flex bg-slate-100 p-4 absolute w-[66.6%] h-[10%] bottom-0' onSubmit={handleSubmit}>
        <div className='w-[70%] relative m-auto flex justify-center items-center'>
          <button className='absolute start-4'><RiAttachment2/></button>
        <input
        type='text'
        placeholder='Send a message'
        className=' rounded-md p-2 w-full ps-[4rem] text-black'
        value={message}
        onChange={chatInputHandler}
        />
        <button className=' absolute inset-y-0 end-4' type='submit'>
          <BsSend/>
        </button>
        </div>
      </form> */}
    
    </>
  ) 
}

export default AppLayout()(Chat)