// import { useDispatch, useSelector } from "react-redux";
// import { getSocket } from "../../socket";
// import { setCallId } from "../../redux/reducers/misc";
// import { setIsCallActive, setPeerConnection } from "../../redux/reducers/video-call";
// import { useRef } from "react";
// import { useRef } from "react";
// import { setCallActive, setPeerConnection } from "../../redux/reducers/action";
// import { useEffect } from "react";
// import { setInComingCall } from "../../redux/reducers/misc";

// function MessageHeader({ conversationUser }) {
//   const socket = getSocket();
//   const { user } = useSelector(state => state.auth);
//   const [incomingCall, setIncomingCall] = useState(null);

//   const initiateCall = (targetUserId) => {
//     console.log("initiate call");
//     const callId = Date.now();
//     socket.emit('call-user', { targetUserId, userId: user._id, callId });
//     // window.location.href = `http://localhost:5173/call/${callId}`;
//   };

//   useEffect(() => {
//     socket.on('call-received', ({ fromUserId, callId }) => {
//       setIncomingCall({ fromUserId, callId });
//     });

//     socket.on('call-accepted', ({ toUserId, callId}) => {
//       console.log("Call accepted, connecting...");
//       window.location.href = `http://localhost:5173/call/${callId}`;
//     });

//     socket.on('call-rejected', () => {
//       console.log("Call rejected");
//       alert('The call was rejected.');
//     });

//     return () => {
//       socket.off('call-received');
//       socket.off('call-accepted');
//       socket.off('call-rejected');
//     };
//   }, [socket, incomingCall]);

//   const handleAcceptCall = () => {
//     console.log("nckonen",incomingCall)
//     if (incomingCall) {
//       console.log(incomingCall);
//       socket.emit('accept-call', { fromUserId: incomingCall.fromUserId, toUserId: user._id, callId: incomingCall.callId});
//       window.location.href = `http://localhost:5173/call/${incomingCall.callId}`;
//       setIncomingCall(null);
//     }
//   };

//   const handleRejectCall = () => {
//     if (incomingCall) {
//       socket.emit('reject-call', { fromUserId: incomingCall.fromUserId });
//       setIncomingCall(null);
//     }
//   };

//   return (
//     <div className='w-full bg-slate-100 sticky top-0 z-20 b-l-1 h-[15%]'>
//       <div className='w-full h-full bg-slate-200 flex p-4 items-center'>
//         <div className='avatar rounded-full w-[50px] h-[50px]'>
//           <img src={conversationUser[0].profile.url} className='rounded-full' alt="profile" />
//         </div>
//         <div className='flex flex-1'>
//           <p className='text-md ms-4'>{conversationUser[0].fullName}</p>
//         </div>
//         <button
//           onClick={() => initiateCall(conversationUser[0]._id)}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         >
//           Call
//         </button>
//       </div>

//       {incomingCall && (
//         <div className="modal">
//           <p>Incoming call. Do you want to accept?</p>
//           <button onClick={handleAcceptCall} className="bg-green-500 text-white py-1 px-3 rounded">
//             Accept
//           </button>
//           <button onClick={handleRejectCall} className="bg-red-500 text-white py-1 px-3 rounded">
//             Reject
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function MessageHeader({ conversationUser }) {
//   const socket = getSocket();
//   const { user } = useSelector((state) => state.auth);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [isCaller, setIsCaller] = useState(false);  // New flag to track if current user is caller

//   const initiateCall = (targetUserId) => {
//     console.log('Initiate call');
//     const callId = Date.now().toString();
//     setIsCaller(true);
//     socket.emit('call-user', { targetUserId, userId: user._id, callId });
//     setIncomingCall({ callId });  // Track outgoing call
//   };

//   useEffect(() => {
//     socket.on('call-received', ({ fromUserId, callId }) => {
//       setIncomingCall({ fromUserId, callId });
//       console.log("call recieved")
//     });

//     socket.on('call-accepted', ({ toUserId , callId}) => {
//       console.log("call-accepted");
//       console.log(isCaller);
//       if (isCaller) {
//         console.log('Call accepted, connecting...');
//         window.location.href = `http://localhost:5173/call/${callId}`;
//       }
//     });

//     socket.on('call-rejected', () => {
//       if (isCaller) {
//         console.log('Call rejected');
//         alert('The call was rejected.');
//         setIsCaller(false);  // Reset caller state
//       }
//     });

//     return () => {
//       socket.off('call-received');
//       socket.off('call-accepted');
//       socket.off('call-rejected');
//     };
//   }, [socket, isCaller, setIncomingCall]);

//   const handleAcceptCall = () => {
//     console.log("inco,ingh calllk")
//     console.log(incomingCall);
//     if (incomingCall) {
//       socket.emit('accept-call', { fromUserId: incomingCall.fromUserId , callId: incomingCall.callId});
//       window.location.href = `http://localhost:5173/call/${incomingCall.callId}`;
//       setIncomingCall(null);
//     }
//   };

//   const handleRejectCall = () => {
//     if (incomingCall) {
//       socket.emit('reject-call', { fromUserId: incomingCall.fromUserId });
//       setIncomingCall(null);
//     }
//   };

//   return (
//     <div className="w-full bg-slate-100 sticky top-0 z-20 h-[15%]">
//       <div className="w-full h-full bg-slate-200 flex p-4 items-center">
//         <div className="avatar rounded-full w-[50px] h-[50px]">
//           <img src={conversationUser[0].profile.url} className="rounded-full" alt="profile" />
//         </div>
//         <div className="flex flex-1">
//           <p className="text-md ms-4">{conversationUser[0].fullName}</p>
//         </div>
//         <button
//           onClick={() => initiateCall(conversationUser[0]._id)}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         >
//           Call
//         </button>
//       </div>

//       {incomingCall?.fromUserId && (
//         <div className="modal">
//           <p>Incoming call. Do you want to accept?</p>
//           <button onClick={handleAcceptCall} className="bg-green-500 text-white py-1 px-3 rounded">
//             Accept
//           </button>
//           <button onClick={handleRejectCall} className="bg-red-500 text-white py-1 px-3 rounded">
//             Reject
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function MessageHeader({ conversationUser }) {
//   const socket = getSocket();
//   const { user } = useSelector((state) => state.auth);
//   // const pc = useRef(null);

//   const dispatch = useDispatch();

// const initiateCall = async(targetUserId) => {
//   const peerConnectionRef = useRef(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     peerConnectionRef.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     const peerConnection = peerConnectionRef.current;

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         console.log("Sending ICE Candidate...");
//         // Emit to signaling server
//         socket.emit('send-ice-candidate', { candidate: event.candidate });
//       }
//     };

//     const callId = Date.now().toString(); // Unique call ID
//     dispatch(setCallId(callId));
//     dispatch(setIsCallActive(true));

//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     console.log("Offer created:", offer);
//     socket.emit('call-user', { targetUserId, userId: user._id, callId });
//     // Emit the offer using socket
//   }, [targetUserId, dispatch]);
// };


//   // const initiateCall = async(targetUserId) => {
//   //   console.log('Initiating call...');
//   //   const callId = Date.now().toString(); // Ensure unique call ID
//   //   dispatch(setCallId(callId));
//   //   const pc = new RTCPeerConnection({
//   //     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//   //   });

//   //   dispatch(setPeerConnection(pc)); // Save peer connection to Redux
//   //   dispatch(setIsCallActive(true));

//   //   pc.onicecandidate = (event) => {
//   //     if (event.candidate) {
//   //       socket.emit('send-ice-candidate', { candidate: event.candidate });
//   //     }
//   //   };

//   //   const offer = await pc.createOffer();
//   //   await pc.setLocalDescription(offer);
//   //   socket.emit('send-offer', { offer, targetUserId: conversationUser[0]._id });
//   //   socket.emit('call-user', { targetUserId, userId: user._id, callId });

//   // };
//     // videoCallRef.current.startCall(targetUserId);
//     // console.log(videoCallRef)
//     // socket.emit('call-user', { targetUserId, userId: user._id, callId });

//   // useEffect(() => {
//   //   const handleCallReceived = ({ fromUserId, callId }) => {
//   //     console.log("inside call received function")
//   //     setInComingCall({ fromUserId, callId });
//   //     console.log(incomingCall);
//   //   };

//   //   const handleCallAccepted = ({ toUserId, callId }) => {
//   //     console.log('Call accepted, connecting...');
//   //     window.location.href = `http://localhost:5173/call/${callId}`;
//   //     setInComingCall(null); // Reset the state to remove the modal
//   //   };

//   //   const handleCallRejected = () => {
//   //     console.log('Call rejected');
//   //     alert('The call was rejected.');
//   //     setInComingCall(null); // Reset the state to remove the modal
//   //   };

//   //   socket.on('call-received', handleCallReceived);
//   //   socket.on('call-accepted', handleCallAccepted);
//   //   socket.on('call-rejected', handleCallRejected);

//   //   return () => {
//   //     socket.off('call-received', handleCallReceived);
//   //     socket.off('call-accepted', handleCallAccepted);
//   //     socket.off('call-rejected', handleCallRejected);
//   //   };
//   // }, [socket]);
  

//   return (
//     <div className="w-full bg-slate-100 sticky top-0 z-20 h-[15%]">
//       <div className="w-full h-full bg-slate-200 flex p-4 items-center">
//         <div className="avatar rounded-full w-[50px] h-[50px]">
//           <img src={conversationUser[0].profile.url} className="rounded-full" alt="profile" />
//         </div>
//         <div className="flex flex-1">
//           <p className="text-md ms-4">{conversationUser[0].fullName}</p>
//         </div>
//         <button
//           onClick={() => initiateCall(conversationUser[0]._id)}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         >
//           Call
//         </button>
//       </div>
//     </div>
//   );
// }


// export default MessageHeader

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { setIsCallActive, setCallId } from "./reducers/video"; // Adjust the path accordingly
import { getSocket } from "../../socket";
import { useVideoCall } from "../../context/VideoCallContext";
import { setCallId, setIsCallActive } from "../../redux/reducers/misc";
// import { setCallId, setIsCallActive } from "../../redux/reducers/misc";

function MessageHeader({ conversationUser }) {
  const socket = getSocket();
  console.log("socket",socket);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { setPeerConnection } = useVideoCall();


  // const peerConnectionRef = useRef(null);
  const [callId, setCallIdState] = useState(null);

  // Function to initiate the call
  const initiateCall = async (targetUserId) => {
    console.log("Initiating call...");

    // Create a unique call ID
    const generatedCallId = Date.now().toString();
    setCallIdState(generatedCallId);
    dispatch(setCallId(generatedCallId));
    dispatch(setIsCallActive(true));

    // Create the RTCPeerConnection instance
    // const pc = new RTCPeerConnection({
    //   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    // });

    // // const peerConnection = peerConnectionRef.current;
    // setPeerConnection(pc);
    // console.log("poc---->>>>",pc);

    // pc.onicecandidate = (event) => {
    //   console.log("setting ice candidates",event);
    //   if (event.candidate) {
    //     console.log("Sending ICE Candidate...");
    //     socket.emit("send-ice-candidate", { candidate: event.candidate });
    //   }
    // };

    // // Create offer and set it as local description
    // const offer = await pc.createOffer();
    // await pc.setLocalDescription(offer);
    // console.log("Offer created:", offer);
    // // Emit the offer and call details to the signaling server
    socket.emit("call-user", { targetUserId, userId: user._id, callId: generatedCallId });
    // socket.emit("send-offer", {offer, targetUserId});
  };

  // Effect to handle socket events for incoming calls
  // useEffect(() => {
  //   const handleCallReceived = ({ fromUserId, callId }) => {
  //     console.log("Incoming call from user:", fromUserId);
  //     setCallIdState(callId);
  //   };

  //   const handleCallAccepted = ({ toUserId, callId }) => {
  //     console.log("Call accepted, connecting...");
  //     window.location.href = `http://localhost:5173/call/${callId}`;
  //   };

  //   const handleCallRejected = () => {
  //     console.log("Call rejected");
  //     alert("The call was rejected.");
  //   };

  //   socket.on("call-received", handleCallReceived);
  //   socket.on("call-accepted", handleCallAccepted);
  //   socket.on("call-rejected", handleCallRejected);

  //   return () => {
  //     socket.off("call-received", handleCallReceived);
  //     socket.off("call-accepted", handleCallAccepted);
  //     socket.off("call-rejected", handleCallRejected);
  //   };
  // }, [socket]);

  return (
    <div className="w-full bg-slate-100 sticky top-0 z-20 h-[15%]">
      <div className="w-full h-full bg-slate-200 flex p-4 items-center">
        <div className="avatar rounded-full w-[50px] h-[50px]">
          <img src={conversationUser[0].profile.url} className="rounded-full" alt="profile" />
        </div>
        <div className="flex flex-1">
          <p className="text-md ms-4">{conversationUser[0].fullName}</p>
        </div>
        <button
          onClick={() => initiateCall(conversationUser[0]._id)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Call
        </button>
      </div>
    </div>
  );
}

export default MessageHeader;
