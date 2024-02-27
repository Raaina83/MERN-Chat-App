import React from 'react'
import Header from './Header'
import MessageBox from './MessageBox'
import MessageInput from './MessageInput'
import NoChatSelected from './NoChatSelected'

function MessageContainer() {
  const noChatSelected = false;

  return (
    <div className='flex flex-col w-full relative'>
      {noChatSelected? <NoChatSelected/> : (
        <>
    <Header/>
    <MessageBox/>
    <MessageInput/>
    </>
  )}
    </div>
  )
}

export default MessageContainer