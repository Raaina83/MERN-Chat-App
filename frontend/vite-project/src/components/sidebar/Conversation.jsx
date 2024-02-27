import React from 'react'

function Conversation() {
  return (
    <div className='hover:bg-gray-300  h-[75px] w-full my-2'>
    <div className='flex h-full pt-2'>
        <div className='avatar online rounded-full w-[50px] h-[50px] mx-2'>
            <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=fa
            cearea&facepad=2&w=256&h=256&q=80" className='rounded-full'></img>
        </div>

        <div className='flex flex-1 border-b-2 border-gray-300 me-4'>
            <div className='flex pt-2'>
                <p className='text-md ms-4'>Priya Jyot</p>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Conversation