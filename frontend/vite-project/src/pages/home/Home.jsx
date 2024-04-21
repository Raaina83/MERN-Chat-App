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


function Home() {
  const {isMobileMenu} = useSelector((state) => state.misc)
  const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")
  const dispatch = useDispatch()

  const handleMobileClose = () => dispatch(setIsMobileMenu(false))

  useErrors([{isError, error}])

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col relative'>
      <div className='w-[100vw] h-[10vh] bg-slate-300 static top-0'>
        <Header></Header>
      </div>
      <Drawer open={isMobileMenu} onClose={handleMobileClose}>
        <ConversationBox></ConversationBox>
      </Drawer>
      <div className='w-[100vw] h-[90vh] bg-white flex' >
        <Sidebar className='hidden sm:flex' />
        <MessageContainer/>
      </div>
    </div>
  )
}

export default Home