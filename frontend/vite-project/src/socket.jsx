import { useEffect } from 'react'
import { createContext, useContext, useMemo } from 'react'
import io from 'socket.io-client'


const SocketContext = createContext()

const getSocket = () => useContext(SocketContext)
// const getSocket = () => {
//     const socket = useContext(SocketContext);
//     if (!socket) {
//       throw new Error('getSocket must be used within a SocketProvider');
//     }
//     return socket;
//   };
  

const SocketProvider = ({children}) => {
    // const socket = useMemo(() => 
    //     io('http://localhost:5000', {
    //     withCredentials: true,
    //     // auth: { token: localStorage.getItem("token")}
    // }), [])

    // useEffect(() => {
    //     return () => {
    //       if (socket) {
    //         // Remove event listeners instead of disconnecting the socket
    //         socket.removeAllListeners(); // Clean up listeners
    //       }
    //     };
    //   }, [socket]);
    const socket = useMemo(() => {
        const instance = io('http://localhost:5000', {
          withCredentials: true,
        });
        instance.on('connect', () => {
          console.log('Socket connected:', instance.id);
        });
        instance.on('disconnect', () => {
          console.log('Socket disconnected');
        });
        return instance;
      }, []);
      

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export {SocketProvider, getSocket}