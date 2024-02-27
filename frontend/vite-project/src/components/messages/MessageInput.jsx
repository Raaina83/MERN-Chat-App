import React from 'react'
import {BsSend} from 'react-icons/bs'

function MessageInput() {
  return (
    <form className='flex bg-slate-100 p-3'>
        <div className='w-[70%] relative m-auto'>
        <input
        type='text'
        placeholder='Send a message'
        className=' rounded-md p-2 w-full'/>
        <button className=' absolute inset-y-0 end-4'>
            <BsSend/>
        </button>
        </div>
    </form>
  )
}

export default MessageInput