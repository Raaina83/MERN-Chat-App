import React, { useState } from 'react'
import {BsSend} from 'react-icons/bs'
import useSendMessages from '../../hooks/useSendMessages'
import { RiAttachment2 } from "react-icons/ri";

function MessageInput({value, handler, handleSubmit}) {
  // const [message, setMessage] = useState("")
  const {loading, sendMessage} = useSendMessages();

  // const handleSubmit = async(e) =>{
  //   e.preventDefault();
  //   if(!message) return
  //   console.log(message)
  //   await sendMessage(message);

  //   setMessage("");
  // }

  return (
    <form className='flex bg-slate-100 p-4 absolute w-[60%] h-[10%] bottom-0' onSubmit={handleSubmit}>
        <div className='w-[70%] relative m-auto flex justify-center items-center'>
          <button className='absolute start-4'><RiAttachment2/></button>
        <input
        type='text'
        placeholder='Send a message'
        className=' rounded-md p-2 w-full ps-[4rem] text-white'
        value={value}
        // onChange={(e) => setMessage(e.target.value)}
        onChange={handler}/>
        <button className=' absolute inset-y-0 end-4' type='submit'>
            {loading? <span className='loading loading-spinner'></span> : <BsSend/>}
        </button>
        </div>
    </form>
  )
}

export default MessageInput