import React from 'react'

function MessageHeader({conversationUser}) {
  return (
    <div className='w-full bg-slate-100 sticky top-0 z-20 b-l-1 h-[15%]'>
        <div className='w-full h-full bg-slate-200 flex p-4 items-center' >
        <div className='avatar rounded-full w-[50px] h-[50px]'>
            <img src={conversationUser.profile[0]} className='rounded-full'></img>
        </div>

        <div className='flex flex-1'>
            <div className='flex'>
                <p className='text-md ms-4'>{conversationUser.name[0]}</p>
            </div>
        </div>
        </div>
    </div>
  )
}

export default MessageHeader