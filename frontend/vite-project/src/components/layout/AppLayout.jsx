import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../header/Header'
import { Grid, Drawer, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useMyChatsQuery } from '../../redux/api/api'
import { useErrors, useSocketEvents } from '../../hooks/hooks'
import { setIsDeleteMenu, setIsMobileMenu, setIsSelectedDeleteChat } from '../../redux/reducers/misc'
import ConversationBox from '../sidebar/ConversationBox'
import { getSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'
import { getOrSaveFromStorage } from '../../lib/features'
import DeleteChatMenu from '../dialogs/DeleteChatMenu'
import { Helmet } from 'react-helmet-async'

const AppLayout = () => (WrappedComponent) => {
    return function WC(props) {
        const params = useParams()
        const chatId = params.chatId
        const socket = getSocket()

        const [onlineUsers, setOnlineUsers] = useState([])

        const deleteAnchor = useRef(null)

        const {isMobileMenu} = useSelector((state) => state.misc)
        const {newMessagesAlert}  = useSelector((state) => state.chat)
        const {user} = useSelector((state) => state.auth)

        const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")

        const dispatch = useDispatch()
        const navigate = useNavigate()

        useErrors([{isError, error}])

        useEffect(() => {
            getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert})
        }, [newMessagesAlert])

        const handleMobileClose = () => dispatch(setIsMobileMenu(false))

        const handleDeleteChat = (e, chatId, groupChat) => {
            dispatch(setIsDeleteMenu(true))
            dispatch(setIsSelectedDeleteChat({chatId, groupChat}))
            deleteAnchor.current = e.currentTarget
        }

        const newMessageAlertHandler = useCallback((data) => {
            if(data.chatId === chatId) return

            dispatch(setNewMessagesAlert(data))
        }, [chatId])

        const newRequestHandler = useCallback(() => {
            dispatch(incrementNotification())
        }, [dispatch])

        const refetchhandler = useCallback(() => {
                refetch()
                navigate("/")
                
        }, [refetch, navigate])

        const onlineUsersListener = useCallback((data) => {
            setOnlineUsers(data)
        })

        const eventHandler = {
            [NEW_MESSAGE_ALERT] : newMessageAlertHandler,
            [NEW_REQUEST] : newRequestHandler,
            [REFETCH_CHATS]: refetchhandler,    
            [ONLINE_USERS]: onlineUsersListener
        }

        useSocketEvents(socket, eventHandler)

        return (
        <div className=' h-[100vh] w-[100vw]'>
            <Helmet>
                <title color='white'>Chat App</title>
                <meta name='description' content='this is the Chat App called Chattu'></meta>
            </Helmet>

            <Header></Header>

            <DeleteChatMenu dispatch={dispatch} deleteOptionAnchor={deleteAnchor}/>

            <Drawer open={isMobileMenu} onClose={handleMobileClose}>
                {isLoading ? (
                <Skeleton/>
                ) :( 
                <ConversationBox 
                chats={data?.chats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}/>
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
                    {isLoading ? <Skeleton/> : (
                        <ConversationBox 
                        chats={data?.chats}
                        chatId={chatId}
                        handleDeleteChat={handleDeleteChat}
                        newMessagesAlert={newMessagesAlert}
                        onlineUsers={onlineUsers}/>
                    )}
                </Grid>

                <Grid item xs={12} sm={8} height={"100%"} >
                    <WrappedComponent {...props} chatId={chatId} user={user}/>
                </Grid>
            </Grid>
            
        </div>
        )
    }
}

export default AppLayout