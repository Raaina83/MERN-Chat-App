import { BrowserRouter, Route, Routes } from "react-router-dom"
import {Toaster} from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import {  SocketProvider } from "./socket"
import ProtectRoute from "./components/auth/ProtectRoute"
import { Suspense, lazy, useEffect } from "react"
import { LayoutLoader } from "./components/layout/Layout"
import axios from "axios"
import { userExists, userNotExists } from "./redux/reducers/auth"
import VideoCall from "./components/video/VideoCall"

const Home = lazy(() => import('./pages/home/Home'))
const Login = lazy(() => import('./pages/login/Login'))
const Chat = lazy(() => import('./pages/chat/Chat'))
const Group = lazy(() => import('./pages/group/Group'))

function App() {
  const {user, loader} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  // const { isCallActive, callId } = useSelector((state) => state.misc);
  // const {iscallAccepted} = useSelector((state) => state.misc);
  // const [token, setToken] = useState(undefined);
  // const navigate = useNavigate("/");

  // useEffect(() => {
  //           const getToken = async() => {
  //             try {
  //               const {data} = await axios.get(`http://localhost:5000/api/v1/auth/generate-token/${user._id}`);
  //               const token = data.zego_token;
  //               console.log("token--->", token);
  //               setToken(token);
  //             } catch (error) {
  //               console.log(error);
  //             }
  //           }
  //         }, [iscallAccepted]);

          // useEffect(() => {

          //   // socket.on('receive-offer', async (offer) => {
          //   //   console.log(offer);
          //   //   console.log("receive-offfferrrr",peerConnection);
          //   //   const pc = new RTCPeerConnection({
          //   //     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
          //   //   });
          
          //   //   setPeerConnection(pc); // Store the peer connection
          
          //   //   // Set the remote description to the received offer
          //   //   await pc.setRemoteDescription(new RTCSessionDescription(offer));
          
          //   //   // Create an answer and set it as local description
          //   //   const answer = await pc.createAnswer();
          //   //   await pc.setLocalDescription(answer);
          
          //   //   // Emit the answer to the caller
          //   //   socket.emit('send-answer', { answer, targetUserId: offer.targetUserId});
          //   // });
            
          //     const handleCallReceived = ({ fromUserId, callId }) => {
          //       console.log("inside call received function")
          //       dispatch(setInComingCall({ fromUserId, callId, userToCall: user._id}));
          //     };
          
          //     const handleCallAccepted = async ({me, toUserId, callId }) => {
          //       console.log('Call accepted, connecting...');
          //       // const pc = new RTCPeerConnection({
          //       //   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          //       // });
            
          //       // const peerConnection = peerConnectionRef.current;
          //       // setPeerConnection(pc);
          //       // console.log("poc---->>>>",pc);
            
          //       // pc.onicecandidate = (event) => {
          //       //   console.log("setting ice candidates",event);
          //       //   if (event.candidate) {
          //       //     console.log("Sending ICE Candidate...");
          //       //     socket.emit("send-ice-candidate", { candidate: event.candidate });
          //       //   }
          //       // };
            
          //       // Create offer and set it as local description
          //       // const offer = await pc.createOffer();
          //       // await pc.setLocalDescription(offer);
          //       // console.log("Offer created:", offer);
          //       // Emit the offer and call details to the signaling server
          //       // socket.emit("send-offer", {offer, me, toUserId});
          //       console.log(me, toUserId);
          //       console.log("callId",callId);
          //       try {
          //         const {data} = await axios.get(`http://localhost:5000/api/v1/auth/generate-token/${user._id}`, {withCredentials: true});
          //         const token = data.zego_token;
          //         console.log("token--->", token);
          //         // setToken(token);
          //       } catch (error) {
          //         console.log(error);
          //       }
          //       dispatch(setIsCallActive(true));
          //       // navigate('/');
          //       // console.log(isCall)
          //       // window.location.href = `https://localhost:5173/call/${callId}`;
          //       dispatch(setCallId(callId));
          //       dispatch(setInComingCall(null)); // Reset the state to remove the modal 
          //       // console.log("bjdhfuewhfueyfuyfuryfurhgfurh")
          //     };
          
          //     const handleCallRejected = () => {
          //       console.log('Call rejected');
          //       alert('The call was rejected.');
          //       dispatch(setInComingCall(null)); // Reset the state to remove the modal
          //     };
          
          //     socket.on('call-received', handleCallReceived);
          //     socket.on('call-accepted', handleCallAccepted);
          //     socket.on('call-rejected', handleCallRejected);
          
          //     return () => {
          //       socket.off('call-received', handleCallReceived);
          //       socket.off('call-accepted', handleCallAccepted);
          //       socket.off('call-rejected', handleCallRejected);
          //     };
          //   }, [socket, user]);


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/users/me", { withCredentials: true })
      .then(({ data }) => {
        dispatch(userExists(data.user))
      })
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  if(loader) return <LayoutLoader/>


  return (
    <SocketProvider>
    <BrowserRouter>
    <Suspense fallback={<LayoutLoader/>}>
    <Routes>
      <Route element={
          <ProtectRoute user={user}/>
      }>
        <Route path="/" element={ <Home/>}></Route>
        <Route path="/chat/:chatId" element={ <Chat />} />
        <Route path="/group" element={<Group></Group>}></Route>
        <Route path="/call/" element={<VideoCall/>} />
        
      </Route>

      <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
    </Routes>
    <Toaster/>
    </Suspense>
    </BrowserRouter>
    </SocketProvider>
  )
}

// function App() {
//   const { user, loader } = useSelector((state) => state.auth);
//   const { isCallActive, callId } = useSelector((state) => state.misc);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/v1/users/me", { withCredentials: true })
//       .then(({ data }) => dispatch(userExists(data.user)))
//       .catch(() => dispatch(userNotExists()));
//   }, [dispatch]);

//   if (loader) return <LayoutLoader />;

//   return (
//     <SocketProvider>
//       <BrowserRouter>
//         <Suspense fallback={<LayoutLoader />}>
//           <Routes>
//             <Route element={<ProtectRoute user={user} />}>
//               <Route path="/" element={<Home />} />
//               <Route path="/chat/:chatId" element={<Chat />} />
//               <Route path="/group" element={<Group />} />
//             </Route>
//             <Route
//               path="/login"
//               element={
//                 <ProtectRoute user={!user} redirect="/">
//                   <Login />
//                 </ProtectRoute>
//               }
//             />
//           </Routes>
//         </Suspense>

//         {isCallActive && (
//           <div className="video-call-modal">
//             {/* <button onClick={() => dispatch(closeCall())}>Close</button> */}
//             <VideoCall />
//           </div>
//         )}
//       </BrowserRouter>
//     </SocketProvider>
//   );
// }


export default App
