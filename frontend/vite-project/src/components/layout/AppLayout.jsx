import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../header/Header'
import { Grid, Drawer, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useMyChatsQuery } from '../../redux/api/api'
import { useErrors, useSocketEvents } from '../../hooks/hooks'
import { setCallId, setInComingCall, setIsCallAccepted, setIsCallActive, setIsDeleteMenu, setIsMobileMenu, setIsSelectedDeleteChat, setToken } from '../../redux/reducers/misc'
import ConversationBox from '../sidebar/ConversationBox'
import { getSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'
import { getOrSaveFromStorage } from '../../lib/features'
import DeleteChatMenu from '../dialogs/DeleteChatMenu'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'

function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

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
        const {inComingCall} = useSelector((state) => state.misc);
        const {iscallAccepted} = useSelector((state) => state.misc);

        const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")

        const dispatch = useDispatch()
        const navigate = useNavigate()

        useErrors([{isError, error}])

        useEffect(() => {
            console.log(inComingCall);
            if (inComingCall) {
              console.log("Incoming call state updated:", inComingCall);
            }
          }, [inComingCall]);

        useEffect(() => {
            getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert})
        }, [newMessagesAlert])

        useEffect(() => {
         const handleCallReceived = ({ fromUserId, callId }) => {
              console.log("inside call received function")
              dispatch(setInComingCall({ fromUserId, callId, userToCall: user._id}));
            };
        
            const handleCallAccepted = async ({me, toUserId, callId }) => {
              const roomID = getUrlParams().get('roomID') || randomID(5);
              console.log('Call accepted, connecting...');
              console.log(me, toUserId);
              console.log("callId",callId);
              socket.emit('sending-roomID', {roomID, toUserId, fromUser: user._id});
              try {
                const {data} = await axios.get(`http://localhost:5000/api/v1/auth/generate-token/${user._id}`, {withCredentials: true});
                const token = data.zego_token;
                console.log("token--->", token);
                dispatch(setToken(token))
                // setToken(token);
              } catch (error) {
                console.log(error);
              }
              dispatch(setIsCallActive(true));
              navigate(`/call?roomID=${roomID}`);
              dispatch(setCallId(callId));
              dispatch(setInComingCall(null)); // Reset the state to remove the modal 
            };
        
            const handleCallRejected = () => {
              console.log('Call rejected');
              alert('The call was rejected.');
              dispatch(setInComingCall(null)); // Reset the state to remove the modal
            };

            const handleCall = async({roomID}) => {
              console.log("recieved room id");
              navigate(`/call?roomID=${roomID}`)
            }
        
            socket.on('call-received', handleCallReceived);
            socket.on('call-accepted', handleCallAccepted);
            socket.on('call-rejected', handleCallRejected);
            socket.on('received-roomID', handleCall);
        
            return () => {
              socket.off('call-received', handleCallReceived);
              socket.off('call-accepted', handleCallAccepted);
              socket.off('call-rejected', handleCallRejected);
            };
          }, [socket]);
     

          const handleAcceptCall = () => {
            if (inComingCall) {
              socket.emit('accept-call', {
                fromUserId: inComingCall.fromUserId,
                toUserId: inComingCall.userToCall,
                callId: inComingCall.callId,
              });
              console.log(inComingCall);
              dispatch(setIsCallActive(true));
              console.log("callId",inComingCall.callId);
              dispatch(setCallId(inComingCall.callId));
              console.log("socket-->",socket.id);
              dispatch(setInComingCall(null));
              dispatch(setIsCallAccepted(true));
            }
          };
        
          const handleRejectCall = () => {
            if (inComingCall) {
              socket.emit('reject-call', { fromUserId: inComingCall.fromUserId });
              dispatch(setInComingCall(null));
            }
          };

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
            {inComingCall && (
                <div 
                    className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-lg font-semibold">Incoming call from {inComingCall.fromUserId}</p>
                    <div className="flex space-x-4 mt-4">
                        <button
                        onClick={handleAcceptCall}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                        >
                        Accept
                        </button>
                        <button
                        onClick={handleRejectCall}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                        >
                        Reject
                        </button>
                    </div>
                    </div>
                </div>
            )}
            <Helmet>
                <title color='white'>Chat App</title>
                <meta name='description' content='this is the Chat App called Chattu'></meta>
            </Helmet>

            <Header></Header>

            <DeleteChatMenu dispatch={dispatch} deleteOptionAnchor={deleteAnchor}/>

            <Drawer open={isMobileMenu} onClose={handleMobileClose}>
                {!iscallAccepted &&(isLoading ? (
                <Skeleton/>
                ) :( 
                <ConversationBox 
                chats={data?.chats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}/>
                ))}
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
                     {!iscallAccepted && (isLoading ? <Skeleton/> : (
                       <ConversationBox 
                        chats={data?.chats}
                        chatId={chatId}
                        handleDeleteChat={handleDeleteChat}
                        newMessagesAlert={newMessagesAlert}
                        onlineUsers={onlineUsers}/>
                    ))}
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