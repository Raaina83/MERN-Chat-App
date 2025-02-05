import { createContext, useContext, useMemo } from 'react'
import io from 'socket.io-client'
import { server } from "./constants/config"


const SocketContext = createContext()

const getSocket = () => useContext(SocketContext);
  

const SocketProvider = ({children}) => {
    const socket = useMemo(() => {
        const instance = io(`${server}`, {
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