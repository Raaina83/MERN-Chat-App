import React from 'react'


function Conversation({conversation}) {

  return (
    <div className={`hover:bg-gray-300  h-[75px] w-full my-2 `}
    >
    <div className='flex h-full pt-2 ps-2'>
        <div className='avatar online rounded-full w-[50px] h-[50px] mx-2'>
            <img src={conversation.profile[0]} className='rounded-full'></img>
        </div>

        <div className='flex flex-1 border-b-2 border-gray-300 me-4'>
            <div className='flex pt-2'>
                <p className='text-md ms-4'>{conversation.name[0]}</p>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Conversation