import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../header/Header'
import { Grid, Drawer } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useMyChatsQuery } from '../../redux/api/api'
import { useErrors, useSocketEvents } from '../../hooks/hooks'
import { setIsMobileMenu } from '../../redux/reducers/misc'
import ConversationBox from '../sidebar/ConversationBox'
import { getSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'
import { getOrSaveFromStorage } from '../../lib/features'

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams()
        console.log("params-->",params)
        const chatId = params.chatId
        const socket = getSocket()

        const {isMobileMenu} = useSelector((state) => state.misc)
        const {newMessagesAlert}  = useSelector((state) => state.chat)

        const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")
        const dispatch = useDispatch()

        useErrors([{isError, error}])

        useEffect(() => {
            getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert})
        }, [newMessagesAlert])

        const handleMobileClose = () => dispatch(setIsMobileMenu(false))

        const handleDeleteChat = (e, _id, groupChat) => {
            e.preventDefault()
            console.log("Delete Chat", _id, groupChat)
        }

        const newMessageAlertHandler = useCallback((data) => {
            console.log("data---->data", data)
            if(data.chatId === chatId) return

            dispatch(setNewMessagesAlert(data))
        }, [chatId])

        const newRequestHandler = useCallback(() => {
            dispatch(incrementNotification())
        }, [dispatch])

        const refetchhandler = useCallback(() => {
                refetch()
        }, [refetch])

        const eventHandler = {
            [NEW_MESSAGE_ALERT] : newMessageAlertHandler,
            [NEW_REQUEST] : newRequestHandler,
            [REFETCH_CHATS]: refetchhandler,    
        }

        useSocketEvents(socket, eventHandler)

        return (
        <div className=' h-[100vh] w-[100vw]'>
            <Header></Header>

            <Drawer open={isMobileMenu} onClose={handleMobileClose}>
                {isLoading ? (
                <span className=' loading loading-spinner'></span>
                ) :( 
                <ConversationBox 
                chats={data?.chats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}/>
                )}
            </Drawer>

            <Grid container
            height={"90vh"}
            width={"100%"}
            >
                <Grid
                height={"100%"}
                item
                sm={4}
                
                sx={{
                    display: {xs: "none", sm: "block"}
                }}>
                    {isLoading ? <span className=' loading loading-spinner'></span> : (
                        <ConversationBox 
                        chats={data?.chats}
                        chatId={chatId}
                        handleDeleteChat={handleDeleteChat}
                        newMessagesAlert={newMessagesAlert}/>
                    )}
                </Grid>

                <Grid item xs={12} sm={8} height={"100%"} >
                    <WrappedComponent {...props} chatId={chatId}  />
                </Grid>
                

                {/* <Grid>
                <div className='w-[100vw] h-[90vh] bg-white flex' >
                    <ConversationBox chats={data?.chats}></ConversationBox>
                </div>
                </Grid> */}
            </Grid>
            
        </div>
        )
    }
}

export default AppLayout