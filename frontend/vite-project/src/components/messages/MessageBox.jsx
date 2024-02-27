import React from 'react'
import Message from './Message'

function MessageBox() {
  return (
    <div className='z-10 p-2 overflow-auto'>
        <Message/>
        <Message/>
        <Message/>
        <Message/>
    </div>
  )
}

export default MessageBox