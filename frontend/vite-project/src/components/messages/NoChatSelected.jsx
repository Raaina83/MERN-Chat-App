import React from 'react'
import { TiMessages } from "react-icons/ti";
import { useSelector } from 'react-redux';

function NoChatSelected() {
  const {user} = useSelector(state => state.auth)

  // const {authUser} = useAuthContext();
  return (
    <div className='flex items-center justify-center w-full h-full'>
        <div className='px-4 text-center sm:text-lg md:text-xl  font-semibold flex flex-col items-center gap-2'>
            <p>Welcome 👋 {user.fullName} </p>
            <p>Select a chat to start messaging</p>
            <TiMessages className='text-3xl md:text-6xl text-center' />
        </div>
	</div>
  )
}

export default NoChatSelected