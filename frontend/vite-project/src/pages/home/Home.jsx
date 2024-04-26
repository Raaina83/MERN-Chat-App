import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'
import Header from '../../components/header/Header'
// import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobileMenu } from '../../redux/reducers/misc'
import { Drawer } from '@mui/material'
import ConversationBox from '../../components/sidebar/ConversationBox'
import {useMyChatsQuery} from '../../redux/api/api'
import {useErrors} from '../../hooks/hooks'
import { getSocket } from '../../socket'
import { useParams } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { Box, Typography } from "@mui/material";
// import { grayColor } from "../constants/color";


const Home = () => {
  return (
    <Box bgcolor={"gray"} height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a friend to chat
      </Typography>
    </Box>
  );
  // const params = useParams()
  // const chatId = params.chatId
  // console.log("params",params)
  // console.log("chatId", chatId)

  // const socket = getSocket()

  // console.log("socket-->", socket.id)

  // const {isMobileMenu} = useSelector((state) => state.misc)
  // const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")
  // const dispatch = useDispatch()

  // console.log("Home data chats--->", data?.chats[0])
  // const handleMobileClose = () => dispatch(setIsMobileMenu(false))

  // useErrors([{isError, error}])

  // return (
  //   <div className='w-[100vw] h-[100vh] flex flex-col relative'>
  //     <div className='w-[100vw] h-[10vh] bg-slate-300 static top-0'>
  //       <Header></Header>
  //     </div>

  //     <Drawer open={isMobileMenu} onClose={handleMobileClose}>
  //       {isLoading ? (
  //         <span className=' loading loading-spinner'></span>
  //       ) :( 
  //         <ConversationBox chats={data.chats}></ConversationBox>
  //       )}
  //     </Drawer>

  //     <div className='w-[100vw] h-[90vh] bg-white flex' >
  //       <Sidebar className='hidden sm:flex' />
  //       <MessageContainer/>
  //     </div>
  //   </div>
  //)
}

export default AppLayout()(Home)