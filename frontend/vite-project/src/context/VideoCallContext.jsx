import React, { createContext, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../socket';
import { setInComingCall } from '../redux/reducers/misc';

const VideoCallContext = createContext();

export const useVideoCall = () => {
  return useContext(VideoCallContext);
};

export const VideoCallProvider = ({ children }) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [callId, setCallId] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [name, setName] = useState('');
  const [me, setMe] = useState('');

  const {inComingCall} = useSelector((state) => state.misc);
  const {user} = useSelector(state => state.auth);
  const socket = getSocket();
  const dispatch = useDispatch();

   const handleAcceptCall = () => {
    if (inComingCall) {
      socket.emit('accept-call', {
        fromUserId: inComingCall.fromUserId,
        toUserId: user._id,
        callId: inComingCall.callId,
      });
      console.log(socket.id);
      // window.location.href = `http://localhost:5173/call/${inComingCall.callId}`;
      // navigate("/");
      dispatch(setInComingCall(null));
      dispatch(setIsCallActive(true));
      // dispatch(cal)
    }
  };

  const handleRejectCall = () => {
    if (inComingCall) {
      socket.emit('reject-call', { fromUserId: inComingCall.fromUserId });
      dispatch(setInComingCall(null));
    }
  };

  return (
    <VideoCallContext.Provider
      value={{
        peerConnection,
        setPeerConnection,
        callId,
        setCallId,
        isCallActive,
        setIsCallActive,
        handleAcceptCall,
        handleRejectCall
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
